import React from 'react';
import {
  Title,
  Content,
} from '@patternfly/react-core';

/**
 * Installed Operators Page
 * 
 * Placeholder page for the Installed Operators view.
 */
export const InstalledOperatorsPage: React.FC = () => {
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
          Installed Operators
        </Title>
        <Content style={{ color: '#6a6e73' }}>
          This page will display installed operators in a future iteration.
        </Content>
      </div>
    </div>
  );
};

