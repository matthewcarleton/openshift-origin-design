import React from "react";
import ReactDOM from "react-dom/client";
import App from '@app/index';
import { ImpersonationProvider } from '@app/shared/contexts/ImpersonationContext';
import { UseCaseProvider } from '@app/shared/contexts/UseCaseContext';

if (process.env.NODE_ENV !== "production") {
  const config = {
    rules: [
      {
        id: 'color-contrast',
        enabled: false
      }
    ]
  };
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000, config);
}

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <UseCaseProvider>
      <ImpersonationProvider>
        <App />
      </ImpersonationProvider>
    </UseCaseProvider>
  </React.StrictMode>
)
