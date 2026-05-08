import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@patternfly/react-core/dist/styles/base.css";
import "./AppChrome.css";

import { App } from "./App";

/** Vite `base` path without trailing slash; omit for site root so React Router uses its default. */
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
