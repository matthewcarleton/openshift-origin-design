/**
 * Core type definitions for the modular prototype architecture
 */

import React from 'react';

/**
 * Prototype status in its lifecycle
 */
export type PrototypeStatus = 'draft' | 'in-progress' | 'in-review' | 'done' | 'paused' | 'archived';

/**
 * Available perspectives in the application
 */
export type PerspectiveType = 'fleet-management' | 'fleet-virtualization' | 'core-platforms';

/**
 * Owner information for a prototype
 */
export interface PrototypeOwner {
  name: string;
  slack?: string;
  email?: string;
  github?: string;
}

/**
 * User persona for the prototype
 */
export interface PrototypePersona {
  name: string;
  role: string;
  organization?: string;
}

/**
 * Research task definition
 */
export interface PrototypeTask {
  title: string;
  description: string;
  steps?: string[];
}

/**
 * Complete prototype configuration
 * This is the manifest file for each prototype
 */
export interface PrototypeConfig {
  // Identity
  id: string;
  name: string;
  description: string;
  
  // Hierarchy (for nested prototypes)
  parentId?: string;     // If this is a child of another prototype
  isParent?: boolean;    // If this prototype has children
  childOrder?: number;   // Display order within parent (optional)
  
  // Versioning (for design iterations)
  versionGroup?: string; // Groups related versions together (e.g., 'fleet-admin-rbac')
  version: string;       // Version identifier (e.g., 'v1', 'v2', 'final', '1.0.0')
  versionLabel?: string; // Optional display label (e.g., 'Initial Design', 'Iteration 2')
  
  // Ownership
  owner: PrototypeOwner;
  status: PrototypeStatus;
  
  // Context
  persona: PrototypePersona;
  task?: PrototypeTask;
  perspectives: PerspectiveType[];
  tags: string[];
  
  // Dependencies
  dependencies?: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;

  /**
   * When true, hide from launcher / index listings; prototype remains loadable via direct URL (?prototype= or path match).
   */
  private?: boolean;
  
  // Optional custom branding
  branding?: {
    icon?: string;
    color?: string;
    banner?: string;
  };
}

/** Whether a prototype should appear in discovery UI (launcher, filters, hub-synced listings). */
export function isPrototypeListed(config: PrototypeConfig): boolean {
  return config.private !== true;
}

/**
 * Route configuration for a prototype
 */
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  label?: string;
  title?: string;
  exact?: boolean;
  navigation?: {
    group: string;
    order?: number;
    icon?: React.ComponentType;
    /** Optional second-level label under `group` (e.g. Observe → AI Hub → …). */
    subMenu?: string;
    /** Order among siblings inside the same `subMenu`. */
    subMenuOrder?: number;
  };
}

/**
 * Route group for navigation
 */
export interface RouteGroup {
  label: string;
  routes: RouteConfig[];
  disabled?: boolean;
  order?: number;
}

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  groups: RouteGroup[];
}

/**
 * Complete prototype module
 * Loaded dynamically from each prototype directory
 */
export interface PrototypeModule {
  config: PrototypeConfig;
  routes: RouteConfig[];
  navigation?: NavigationConfig;
  component?: React.ComponentType; // React component wrapper for the prototype
  onActivate?: () => void;
  onDeactivate?: () => void;
}

/**
 * Prototype registry entry
 */
export interface PrototypeRegistryEntry {
  module: PrototypeModule;
  path: string;
}

/**
 * Filter options for prototype listing
 */
export interface PrototypeFilters {
  status?: PrototypeStatus[];
  tags?: string[];
  owner?: string;
  perspective?: PerspectiveType;
  search?: string;
}

/**
 * Prototype loader context
 */
export interface PrototypeContextType {
  currentPrototype: PrototypeModule | null;
  availablePrototypes: PrototypeModule[];
  loadPrototype: (id: string) => Promise<void>;
  isLoading: boolean;
  /** True until registry init finishes and optional deep-link prototype load completes */
  isBootstrapping: boolean;
  error: Error | null;
}

/**
 * Shared component metadata
 */
export interface SharedComponentMetadata {
  name: string;
  path: string;
  category: 'layout' | 'form' | 'table' | 'wizard' | 'navigation' | 'chart' | 'utility';
  description: string;
  props?: Record<string, unknown>;
  examples?: string[];
  dependencies?: string[];
}

