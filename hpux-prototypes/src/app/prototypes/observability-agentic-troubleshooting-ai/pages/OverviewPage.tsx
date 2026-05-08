import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';

/** Home → Overview (agentic prototype). Same full-page shell as OperatorHub install flows in this repo. */
export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="ols-agentic-home-overview-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div className="create-policy-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/core/home/overview');
            }}
          >
            Home
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Overview</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="create-policy-header">
        <Title headingLevel="h1" size="2xl">
          Agentic troubleshooting (AI)
        </Title>
        <Content component="p" style={{ marginTop: '8px', color: '#6a6e73' }}>
          Use this prototype to explore conversational and multi-step agent flows that help operators narrow down
          observability issues across metrics, logs, and traces.
        </Content>
      </div>

      <div
        role="main"
        aria-label="Home overview content"
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="lg">
                Next steps
              </Title>
              <Content component="p" style={{ marginTop: '16px', color: '#3c3f42' }}>
                Add screens for incident context, evidence panels, and agent run transcripts under this prototype directory
                only.
              </Content>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
