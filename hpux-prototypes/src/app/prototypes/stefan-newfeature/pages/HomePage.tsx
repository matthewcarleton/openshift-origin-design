import React, { useState } from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  Button,
} from '@patternfly/react-core';
import { StandardModal } from '@app/shared/components/feedback';

/**
 * Home Page
 * 
 * This is the landing page for the prototype.
 * Provides an overview and quick access to key features.
 */
export const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Heading Section - 24px padding */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Home
        </Title>
        <Content>
          <p>Welcome to Stefan's New Feature prototype. This is the landing page where you can get started.</p>
        </Content>
      </div>

      {/* Content Area - 24px padding */}
      <div className="template-page-content">
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              Getting Started
            </Title>
            <Content>
              <p style={{ marginBottom: 'var(--pf-v5-global--spacer--lg)' }}>
                This prototype demonstrates a new feature. Use the navigation to explore different sections.
              </p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Get Started
              </Button>
            </Content>
          </CardBody>
        </Card>
      </div>

      {/* Getting Started Modal */}
      <StandardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Getting Started"
        content={
          <div>
            <p style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              Welcome to Stefan's New Feature prototype! This modal provides an overview of how to get started.
            </p>
            <p style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              Here are some key features you can explore:
            </p>
            <ul style={{ marginLeft: 'var(--pf-v5-global--spacer--lg)', marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              <li>Navigate through different sections using the sidebar</li>
              <li>Explore the prototype features and functionality</li>
              <li>Test interactions and user flows</li>
            </ul>
            <p>
              Click "Close" to dismiss this modal and start exploring the prototype.
            </p>
          </div>
        }
        actionButtonLabel="Close"
        onAction={() => setIsModalOpen(false)}
        buttonPosition="right"
      />
    </>
  );
};
