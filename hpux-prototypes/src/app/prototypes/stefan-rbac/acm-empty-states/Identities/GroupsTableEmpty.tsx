import React from 'react';
import {
  EmptyState,
  Title,
  Content,
  Button,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export const GroupsTableEmpty: React.FC = () => {
  return (
    <EmptyState>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <CubesIcon style={{ fontSize: '80px', color: '#6a6e73', marginBottom: '24px' }} />
        <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
          Create a group
        </Title>
        <Content style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', marginBottom: '16px' }}>
          Description text that allows users to easily understand what this is for and how does it help them achieve their needs.
        </Content>
        <Button variant="link">Link to documentation</Button>
      </div>
    </EmptyState>
  );
};

