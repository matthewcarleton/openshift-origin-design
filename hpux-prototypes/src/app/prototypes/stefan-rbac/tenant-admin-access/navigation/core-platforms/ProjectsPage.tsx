import React from 'react';
import { Title, Content } from '@patternfly/react-core';
import { Projects } from '../../Projects/Projects';

export const ProjectsPage: React.FunctionComponent = () => {
  return (
    <div className="projects-page-container">
      <div className="page-header-section">
        <Title headingLevel="h1" size="lg">
          Projects
        </Title>
        <Content component="p" style={{ marginTop: '8px', color: 'var(--pf-t--global--text--color--regular)' }}>
          A project is a Kubernetes namespace with additional annotations. Projects allow a community of users to organize and manage their content in isolation from other communities.
        </Content>
      </div>
      
      <div className="page-content-section">
        <Projects />
      </div>
    </div>
  );
};

