import { useState, useLayoutEffect, useCallback } from "react";
import LightSpeedPanel from "./LightSpeedPanel";
import { useChat } from "../contexts/ChatContext";

/** Default system prompt passed when opening; path-specific copy still comes from LightSpeedPanel route logic. */
const DEFAULT_LIGHTSPEED_CONTEXT =
  "Hi John! I'm OpenShift LightSpeed, your AI assistant for cluster and operator management.\n\nI can help you with:\n• Cluster updates\n• Operator lifecycle management\n• General cluster information and health\n• Troubleshooting and remediation\n\nWhat would you like to know?";

/**
 * Renders LightSpeed at the app root (next to {@link Outlet}), not under {@link Layout} / PatternFly Page,
 * and the panel itself portals to `document.body` with `position: fixed` so it never scrolls with main.
 */
export default function LightSpeedGlobalMount() {
  const { isOpen, setIsOpen } = useChat();

  const [lightSpeedDockTop, setLightSpeedDockTop] = useState<number | null>(null);
  const measureLightSpeedDockTop = useCallback(() => {
    const main = document.getElementById("app-main-container");
    if (!main) return;
    const r = main.getBoundingClientRect();
    setLightSpeedDockTop(Math.max(0, Math.round(r.top)));
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setLightSpeedDockTop(null);
      return undefined;
    }
    measureLightSpeedDockTop();
    const raf = window.requestAnimationFrame(() => measureLightSpeedDockTop());
    window.addEventListener("resize", measureLightSpeedDockTop);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureLightSpeedDockTop);
    };
  }, [isOpen, measureLightSpeedDockTop]);

  return (
    <LightSpeedPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      dockTop={lightSpeedDockTop}
      context={DEFAULT_LIGHTSPEED_CONTEXT}
    />
  );
}
