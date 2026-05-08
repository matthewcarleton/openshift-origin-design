import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { AgenticGlobalAiAssistant } from './AgenticGlobalAiAssistant';
import { SimulationProvider } from '../simulation/SimulationProvider';

const HOST_ID = 'observability-agentic-global-ai-root';

let root: Root | undefined;

/** Mount the global Lightspeed chat portal (singleton) when this prototype is active. */
export function ensureAgenticGlobalAiMounted(): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (root) {
    return;
  }
  let el = document.getElementById(HOST_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = HOST_ID;
    document.body.appendChild(el);
  }
  root = createRoot(el);
  root.render(
    <SimulationProvider>
      <AgenticGlobalAiAssistant />
    </SimulationProvider>
  );
}

/** Remove the portal from the document (e.g. when leaving the prototype or the launcher). */
export function unmountAgenticGlobalAi(): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (root) {
    try {
      root.unmount();
    } catch {
      // ignore double-unmount
    }
    root = undefined;
  }
  const el = document.getElementById(HOST_ID);
  if (el?.parentNode) {
    el.parentNode.removeChild(el);
  }
}
