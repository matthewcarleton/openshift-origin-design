import React from 'react';
import { Title } from '@patternfly/react-core';
import { IdentityProvider } from '../../IdentityProvider/IdentityProvider';

interface IdentityProvidersPageProps {
  showClustersColumn?: boolean;
}

export const IdentityProvidersPage: React.FunctionComponent<IdentityProvidersPageProps> = ({ showClustersColumn = true }) => {
  return (
    <div className="identity-providers-page-container">
      <div className="page-header-section">
        <Title headingLevel="h1" size="lg">
          Identity Providers
        </Title>
      </div>
      
      <div className="page-content-section">
        <IdentityProvider showClustersColumn={showClustersColumn} />
      </div>
    </div>
  );
};
