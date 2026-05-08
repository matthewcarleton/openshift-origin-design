import * as React from 'react';
import { Title, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { useImpersonation } from '@app/contexts/ImpersonationContext';

interface EmptyPageProps {
  title: string;
}

const EmptyPage: React.FC<EmptyPageProps> = ({ title }) => {
  const { impersonatingUser } = useImpersonation();

  return (
    <div style={{ padding: '24px' }}>
      <Title headingLevel="h1" size="2xl" style={{ marginBottom: '24px' }}>
        {title}
      </Title>
      {!impersonatingUser && (
        <EmptyState>
          <Title headingLevel="h4" size="lg">Coming soon</Title>
          <EmptyStateBody>
            This page is under development.
          </EmptyStateBody>
        </EmptyState>
      )}
    </div>
  );
};

export const OverviewPage: React.FC = () => <EmptyPage title="Overview" />;
export const CatalogPage: React.FC = () => <EmptyPage title="Catalog" />;
export const InstanceTypesPage: React.FC = () => <EmptyPage title="InstanceTypes" />;
export const TemplatesPage: React.FC = () => <EmptyPage title="Templates" />;

