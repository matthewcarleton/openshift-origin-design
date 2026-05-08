/**
 * Prototype Context
 *
 * React context for managing the currently active prototype
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PrototypeModule, PrototypeContextType } from './types';
import { prototypeRegistry } from './PrototypeRegistry';
import { findPrototypeIdForPath, getRouterPathname } from './deepLinkUtils';

const PrototypeContext = createContext<PrototypeContextType | undefined>(undefined);

interface PrototypeProviderProps {
  children: ReactNode;
}

export const PrototypeProvider: React.FC<PrototypeProviderProps> = ({ children }) => {
  const location = useLocation();
  const [currentPrototype, setCurrentPrototype] = useState<PrototypeModule | null>(null);
  const [availablePrototypes, setAvailablePrototypes] = useState<PrototypeModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load a prototype by ID
   */
  const loadPrototype = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🚀 Loading prototype: ${id}`);

      const prototype = prototypeRegistry.get(id);

      if (!prototype) {
        throw new Error(`Prototype with ID "${id}" not found in registry`);
      }

      // Run previous prototype teardown when switching without going through the launcher
      if (currentPrototype && currentPrototype.config.id !== id) {
        console.log(`👋 Deactivating previous prototype: ${currentPrototype.config.id}`);
        if (currentPrototype.onDeactivate) {
          await currentPrototype.onDeactivate();
        }
      }

      // Call lifecycle hook if defined
      if (prototype.onActivate) {
        await prototype.onActivate();
      }

      setCurrentPrototype(prototype);

      // Store in sessionStorage for persistence across page reloads
      sessionStorage.setItem('activePrototypeId', id);

      console.log(`✅ Loaded prototype: ${prototype.config.name}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load prototype');
      setError(error);
      console.error('❌ Failed to load prototype:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPrototype]);

  const loadPrototypeRef = useRef(loadPrototype);
  loadPrototypeRef.current = loadPrototype;

  /**
   * Initialize registry, then load prototype from (in order): ?prototype=, URL path match,
   * or last session — supports GitHub Pages shared links and same-tab reload.
   */
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        console.log('🚀 Initializing prototype system...');

        await prototypeRegistry.initialize();
        if (cancelled) {
          return;
        }

        const prototypes = prototypeRegistry.getAll();
        console.log(`📦 Loaded ${prototypes.length} prototypes`, prototypes.map((p) => p.config.id));
        setAvailablePrototypes(prototypes);

        const params = new URLSearchParams(window.location.search);
        let prototypeId = params.get('prototype');
        if (!prototypeId) {
          prototypeId = findPrototypeIdForPath(getRouterPathname());
        }
        if (!prototypeId) {
          const savedId = sessionStorage.getItem('activePrototypeId');
          if (savedId && prototypeRegistry.get(savedId)) {
            prototypeId = savedId;
            console.log(`♻️ Restoring prototype from session: ${savedId}`);
          }
        }

        if (prototypeId && prototypeRegistry.get(prototypeId)) {
          await loadPrototypeRef.current(prototypeId);
        } else {
          console.log('✅ Ready — no matching prototype found');
        }
      } catch (err) {
        console.error('❌ Failed to initialize prototype system:', err);
        setError(err as Error);
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Keep the loaded module in sync when `?prototype=` changes after bootstrap (embed parent updates
   * query, or in-app navigation alters search) without always reloading the document.
   */
  useEffect(() => {
    if (isBootstrapping) {
      return;
    }
    const params = new URLSearchParams(location.search);
    const prototypeId = params.get('prototype');
    if (!prototypeId || !prototypeRegistry.get(prototypeId)) {
      return;
    }
    if (prototypeId === currentPrototype?.config.id) {
      return;
    }
    void loadPrototype(prototypeId);
  }, [location.search, isBootstrapping, currentPrototype?.config.id, loadPrototype]);

  const value: PrototypeContextType = {
    currentPrototype,
    availablePrototypes,
    loadPrototype,
    isLoading,
    isBootstrapping,
    error,
  };

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
};

/**
 * Hook to access prototype context
 */
export const usePrototype = (): PrototypeContextType => {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('usePrototype must be used within PrototypeProvider');
  }
  return context;
};

/**
 * Hook to get current prototype config
 */
export const usePrototypeConfig = () => {
  const { currentPrototype } = usePrototype();
  return currentPrototype?.config || null;
};

/**
 * Hook to check if a specific prototype is active
 */
export const useIsPrototypeActive = (prototypeId: string): boolean => {
  const { currentPrototype } = usePrototype();
  return currentPrototype?.config.id === prototypeId;
};
