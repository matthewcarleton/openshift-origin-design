import React from "react";
import ReactDOM from "react-dom/client";
import "@patternfly/patternfly/patternfly.css";
import App from "./app/App";
import { applyStoredOrDefaultTheme } from "./lib/documentTheme";
import "./styles/index.css";
import "./styles/global.css";

applyStoredOrDefaultTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
