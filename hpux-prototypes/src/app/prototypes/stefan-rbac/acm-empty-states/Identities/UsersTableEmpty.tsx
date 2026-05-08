import React from 'react';
import {
  EmptyState,
  Title,
  Content,
  Button,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export const UsersTableEmpty: React.FC = () => {
  return (
    <EmptyState>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <CubesIcon style={{ fontSize: '80px', color: '#6a6e73', marginBottom: '24px' }} />
        <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
          In order to view Users, add Identity provider
        </Title>
        <Content style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', marginBottom: '16px' }}>
          Once Identity provider is added, Users will appear in the list after they log in.
        </Content>
        <Button variant="link">Link to documentation</Button>
      </div>
    </EmptyState>
  );
};

