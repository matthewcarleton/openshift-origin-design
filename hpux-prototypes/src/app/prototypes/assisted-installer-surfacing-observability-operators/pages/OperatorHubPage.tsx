import React from 'react';
import {
  Title,
  Content,
} from '@patternfly/react-core';

/**
 * OperatorHub Page
 * 
 * Placeholder page for the OperatorHub view.
 */
export const OperatorHubPage: React.FC = () => {
  return (
    <div style={{ 
      height: '100vh',
      padding: '24px',
      boxSizing: 'border-box',
      backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '16px' }}>
          OperatorHub
        </Title>
        <Content style={{ color: '#6a6e73' }}>
          This page displays the OperatorHub.
        </Content>
      </div>
    </div>
  );
};
