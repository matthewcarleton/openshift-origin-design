import React from 'react';
import {
  EmptyState,
  Title,
  Content,
  Button,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export const IdentityProvidersPageEmpty: React.FC = () => {
  return (
    <div className="identity-providers-page-container">
      <div className="page-header-section">
        <Title headingLevel="h1" size="lg">
          Identity providers
        </Title>
        <div style={{ marginTop: '8px', marginBottom: '16px', color: '#6a6e73' }}>
          Configure identity providers to enable user authentication and access control across your infrastructure.
        </div>
      </div>
      
      <div className="page-content-section">
        <EmptyState>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <CubesIcon style={{ fontSize: '80px', color: '#6a6e73', marginBottom: '24px' }} />
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
              No Identity providers yet
            </Title>
            <Content style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', marginBottom: '16px' }}>
              Description text that allows users to easily understand what this is for and how does it help them achieve their needs.
            </Content>
            <Button variant="primary" style={{ marginBottom: '8px' }}>Add identity provider</Button>
            <Button variant="link">Link to documentation</Button>
          </div>
        </EmptyState>
      </div>
    </div>
  );
};

