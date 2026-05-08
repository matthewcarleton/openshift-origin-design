import React from 'react';
import { Title, Content, Stack, StackItem } from '@patternfly/react-core';
import { AutonomousAiObserveWidget } from '../components/autonomousAiObserve/AutonomousAiObserveWidget';
import './ai-hub-page.css';

export const AIHubPage: React.FC = () => {
  return (
    <div
      className="ols-ai-hub-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div className="create-policy-header">
        <Title headingLevel="h1" size="2xl">
          AI Troubleshooting Hub
        </Title>
        <Content component="p" style={{ marginTop: '8px', color: '#6a6e73' }}>
          Coordinate autonomous AI investigations, evidence collection, and guided remediation workflows for
          observability incidents from one hub.
        </Content>
      </div>

      <div
        id="ols-ai-hub-main"
        role="main"
        aria-label="AI Troubleshooting Hub content"
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <Stack hasGutter>
            <StackItem>
              <AutonomousAiObserveWidget />
            </StackItem>
          </Stack>
        </div>
      </div>
    </div>
  );
};
