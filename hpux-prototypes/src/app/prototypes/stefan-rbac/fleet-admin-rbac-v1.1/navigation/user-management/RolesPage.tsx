import React from 'react';
import { Title } from '@patternfly/react-core';
import { Roles } from '../../Roles/Roles';

export const RolesPage: React.FunctionComponent = () => {
  return (
    <div className="roles-page-container">
      <div className="page-header-section">
        <Title headingLevel="h1" size="lg">
          Roles
        </Title>
      </div>
      
      <div className="page-content-section">
        <Roles />
      </div>
    </div>
  );
};
