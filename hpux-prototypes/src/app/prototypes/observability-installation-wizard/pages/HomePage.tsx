import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Button,
  Card,
  CardBody,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { RocketIcon } from '@patternfly/react-icons';

/**
 * Home Page for Observability Installation Wizard Prototype
 * 
 * This is the landing page that launches the installation wizard.
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchWizard = () => {
    navigate('/core/operators/operatorhub/install-observability');
  };

  return (
    <div style={{ 
      height: '100vh',
      padding: '24px',
      boxSizing: 'border-box',
      backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: '16px' }}>
              Cluster Observability Operator Installation Wizard
            </Title>
            <Content style={{ marginBottom: '24px', color: '#6a6e73' }}>
              This prototype demonstrates the installation wizard for the Cluster Observability Operator (COO).
              The wizard allows users to configure observability components based on persona selection or
              operational needs, with a unified installation flow.
            </Content>
          </StackItem>

          <StackItem>
            <Card>
              <CardBody>
                <Stack hasGutter>
                  <StackItem>
                    <Title headingLevel="h2" size="lg" style={{ marginBottom: '8px' }}>
                      Features
                    </Title>
                    <Content>
                      <ul>
                        <li>3-step installation wizard (Installation details, Observability components, Review and install)</li>
                        <li>Persona-based configuration (Administrator, SRE, Developer)</li>
                        <li>Customizable observability capabilities (Metrics, Logging, Tracing, etc.)</li>
                        <li>Resource estimation based on selected components</li>
                        <li>UI plugin selection with Advanced Mode toggle</li>
                        <li>Interactive prototype with full PatternFly 6 components</li>
                      </ul>
                    </Content>
                  </StackItem>

                  <StackItem>
                    <Button
                      variant="primary"
                      onClick={handleLaunchWizard}
                      icon={<RocketIcon />}
                      size="lg"
                    >
                      Launch Installation Wizard
                    </Button>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </div>
    </div>
  );
};
