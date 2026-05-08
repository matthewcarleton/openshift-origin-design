/**
 * Prototype Registry System
 * 
 * This module handles dynamic discovery and registration of prototypes.
 * It scans the prototypes directory and loads all valid prototype modules.
 */

import React from 'react';
import { PrototypeModule, PrototypeRegistryEntry, PrototypeFilters } from './types';

/**
 * Global prototype registry
 * Maps prototype IDs to their modules
 */
class PrototypeRegistry {
  private prototypes: Map<string, PrototypeRegistryEntry> = new Map();
  private initialized = false;

  /**
   * Register a prototype module
   */
  register(prototypeModule: PrototypeModule, path: string): void {
    const { id } = prototypeModule.config;
    
    if (this.prototypes.has(id)) {
      console.warn(`Prototype with ID "${id}" is already registered. Overwriting...`);
    }

    this.prototypes.set(id, {
      module: prototypeModule,
      path
    });

    console.log(`✅ Registered prototype: ${prototypeModule.config.name} (${id})`);
  }

  /**
   * Get a specific prototype by ID
   */
  get(id: string): PrototypeModule | undefined {
    const entry = this.prototypes.get(id);
    return entry?.module;
  }

  /**
   * Get all registered prototypes
   */
  getAll(): PrototypeModule[] {
    return Array.from(this.prototypes.values()).map(entry => entry.module);
  }

  /**
   * Get filtered prototypes
   */
  filter(filters: PrototypeFilters): PrototypeModule[] {
    let prototypes = this.getAll();

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      prototypes = prototypes.filter(p => 
        filters.status?.includes(p.config.status)
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      prototypes = prototypes.filter(p =>
        filters.tags?.some(tag => p.config.tags.includes(tag))
      );
    }

    // Filter by owner
    if (filters.owner) {
      prototypes = prototypes.filter(p =>
        p.config.owner.name.toLowerCase().includes(filters.owner!.toLowerCase()) ||
        p.config.owner.slack?.toLowerCase().includes(filters.owner!.toLowerCase())
      );
    }

    // Filter by perspective
    if (filters.perspective) {
      prototypes = prototypes.filter(p =>
        p.config.perspectives.includes(filters.perspective!)
      );
    }

    // Filter by search text
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      prototypes = prototypes.filter(p =>
        p.config.name.toLowerCase().includes(searchLower) ||
        p.config.description.toLowerCase().includes(searchLower) ||
        p.config.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return prototypes;
  }

  /**
   * Get prototypes by status
   */
  getByStatus(status: string): PrototypeModule[] {
    return this.getAll().filter(p => p.config.status === status);
  }

  /**
   * Get all unique tags across all prototypes
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.getAll().forEach(p => {
      p.config.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Get all unique owners across all prototypes
   */
  getAllOwners(): string[] {
    const owners = new Set<string>();
    this.getAll().forEach(p => {
      owners.add(p.config.owner.name);
    });
    return Array.from(owners).sort();
  }

  /**
   * Get children of a parent prototype
   */
  getChildren(parentId: string): PrototypeModule[] {
    return this.getAll()
      .filter(p => p.config.parentId === parentId)
      .sort((a, b) => (a.config.childOrder || 0) - (b.config.childOrder || 0));
  }

  /**
   * Get all parent prototypes
   */
  getParents(): PrototypeModule[] {
    return this.getAll().filter(p => p.config.isParent === true);
  }

  /**
   * Get all top-level prototypes (parents + standalones)
   */
  getTopLevel(): PrototypeModule[] {
    return this.getAll().filter(p => !p.config.parentId);
  }

  /**
   * Check if a prototype exists
   */
  has(id: string): boolean {
    return this.prototypes.has(id);
  }

  /**
   * Remove a prototype from the registry
   */
  unregister(id: string): boolean {
    return this.prototypes.delete(id);
  }

  /**
   * Clear all registered prototypes
   */
  clear(): void {
    this.prototypes.clear();
    this.initialized = false;
  }

  /**
   * Check if registry has been initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Mark registry as initialized
   */
  markInitialized(): void {
    this.initialized = true;
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const all = this.getAll();
    return {
      total: all.length,
      'in-progress': all.filter(p => p.config.status === 'in-progress').length,
      draft: all.filter(p => p.config.status === 'draft').length,
      done: all.filter(p => p.config.status === 'done').length,
      archived: all.filter(p => p.config.status === 'archived').length,
      paused: all.filter(p => p.config.status === 'paused').length,
      owners: this.getAllOwners().length,
      tags: this.getAllTags().length
    };
  }

  /**
   * Initialize the registry by discovering all prototypes
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('ℹ️  Prototype registry already initialized');
      return;
    }

    await discoverPrototypes();
  }
}

// Singleton instance
export const prototypeRegistry = new PrototypeRegistry();

/**
 * Auto-discovery function
 * Uses Webpack's require.context to dynamically load all prototype configs
 */
export async function discoverPrototypes(): Promise<void> {
  console.log('🔍 Discovering prototypes...');

  try {
    // Use Webpack's require.context to load all prototype.config.ts files
    // This automatically finds all prototypes in the prototypes directory
    const prototypeConfigs = (require as any).context(
      '../prototypes',
      true, // Include subdirectories
      /prototype\.config\.(ts|tsx|js)$/
    );

    const discoveredCount = prototypeConfigs.keys().length;
    console.log(`📦 Found ${discoveredCount} prototype configuration files`);

    // Load each prototype
    for (const key of prototypeConfigs.keys()) {
      try {
        // Note: _template is now included so users can explore it in the launcher
        // It will appear as "📋 Prototype Template" when status is 'in-progress'

        const configModule = prototypeConfigs(key);
        const config = configModule.config || configModule.default;

        if (!config) {
          console.warn(`⚠️  No config exported from ${key}`);
          continue;
        }

        // Extract prototype directory path
        const prototypePath = key.replace('./','').replace('/prototype.config.ts', '').replace('/prototype.config.tsx', '').replace('/prototype.config.js', '');
        
        // Try to load routes and navigation
        let routes = [];
        let navigation;

        try {
          const routesModule = await import(`../prototypes/${prototypePath}/routes`);
          routes = routesModule.routes || routesModule.default || [];
        } catch (e) {
          console.warn(`⚠️  No routes found for prototype: ${config.id}`);
        }

        try {
          const navModule = await import(`../prototypes/${prototypePath}/navigation`);
          navigation = navModule.navigation || navModule.default;
        } catch (e) {
          // Navigation is optional
        }

        let onActivate: (() => void | Promise<void>) | undefined;
        let onDeactivate: (() => void | Promise<void>) | undefined;
        try {
          const lifecycle = await import(`../prototypes/${prototypePath}/prototype.lifecycle`);
          onActivate = lifecycle.onActivate;
          onDeactivate = lifecycle.onDeactivate;
        } catch {
          // Optional per-prototype activate/deactivate hooks
        }

        // Import PrototypeLayout dynamically to avoid circular dependencies
        const { PrototypeLayout } = await import('./PrototypeLayout');
        
        // Create a component wrapper for this prototype using React.createElement
        const PrototypeComponent = () => 
          React.createElement(PrototypeLayout, { prototype: { config, routes, navigation } });

        // Create prototype module
        const prototypeModule: PrototypeModule = {
          config,
          routes,
          navigation,
          component: PrototypeComponent,
          onActivate,
          onDeactivate,
        };

        // Register it
        prototypeRegistry.register(prototypeModule, prototypePath);
      } catch (error) {
        console.error(`❌ Failed to load prototype from ${key}:`, error);
      }
    }

    prototypeRegistry.markInitialized();
    
    const stats = prototypeRegistry.getStats();
    console.log(`✅ Prototype discovery complete!`);
            console.log(`   Total: ${stats.total} | In-progress: ${stats['in-progress']} | Draft: ${stats.draft} | Done: ${stats.done} | Archived: ${stats.archived}`);
  } catch (error) {
    console.error('❌ Failed to discover prototypes:', error);
    throw error;
  }
}

/**
 * Initialize the prototype registry
 * Call this once at app startup
 */
export async function initializePrototypeRegistry(): Promise<void> {
  if (prototypeRegistry.isInitialized()) {
    console.log('ℹ️  Prototype registry already initialized');
    return;
  }

  await discoverPrototypes();
}

