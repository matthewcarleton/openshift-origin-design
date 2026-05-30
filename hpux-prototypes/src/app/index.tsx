import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/react-styles/css/components/Wizard/wizard.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { PrototypeProvider, usePrototype } from '@app/core/PrototypeContext';
import '@app/app.css';

const AppContent: React.FunctionComponent = () => {
  const { currentPrototype, isLoading, isBootstrapping, error } = usePrototype();

  console.log('AppContent render:', { currentPrototype: currentPrototype?.config?.id, isLoading, isBootstrapping, error });

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>
        <h1>Error Loading Prototypes</h1>
        <pre>{error.message}</pre>
      </div>
    );
  }

  if (isBootstrapping || isLoading) {
    return <div style={{ padding: '40px' }}>Loading prototype...</div>;
  }

  if (!currentPrototype) {
    return (
      <div style={{ padding: '40px' }}>
        <p>No prototype selected. Use a direct link with <code>?prototype=ID</code> to load one.</p>
      </div>
    );
  }

  const PrototypeApp = currentPrototype.component;
  if (!PrototypeApp) {
    return <div style={{ padding: '40px', color: 'red' }}>Error: Prototype component not found</div>;
  }
  
  console.log('Rendering prototype:', currentPrototype.config.id);
  return <PrototypeApp />;
};

const App: React.FunctionComponent = () => {
  console.log('App component rendering');

  return (
    <Router>
      <PrototypeProvider>
        <AppContent />
      </PrototypeProvider>
    </Router>
  );
};

export default App;
