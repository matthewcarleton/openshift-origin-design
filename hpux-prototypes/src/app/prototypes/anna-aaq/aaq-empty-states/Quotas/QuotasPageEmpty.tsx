import React from 'react';
import {
  PageSection,
  EmptyState,
  Title,
  Content,
  Button,
} from '@patternfly/react-core';
import { PlusCircleIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

export const QuotasPageEmpty: React.FC = () => {
  useDocumentTitle('Quotas');

  return (
    <PageSection>
      <div className="quotas-page-container">
        <div className="page-header-section">
          {/* Header */}
          <div>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: '8px' }}>
              Virtualization quotas
            </Title>
            <Content component="p" style={{ color: '#6a6e73', marginBottom: '8px' }}>
              View and manage virtualization-specific resource quotas configured through the Application Aware Quota (AAQ) Operator.
            </Content>
            <a href="#" style={{ color: '#0066cc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Learn more about configuring virtualization quotas via AAQ <ExternalLinkAltIcon />
            </a>
          </div>
        </div>

        <div className="page-content-section">
          <EmptyState>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              <PlusCircleIcon style={{ fontSize: '80px', color: '#6a6e73', marginBottom: '24px' }} />
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                No virtualization quotas yet
              </Title>
              <Content style={{ color: 'var(--pf-t--global--text--color--subtle)', textAlign: 'center', marginBottom: '16px' }}>
                To get started, create your first virtualization quota.
              </Content>
              <Button variant="primary" style={{ marginBottom: '8px' }}>Create quota</Button>
              <Button 
                variant="link" 
                icon={<ExternalLinkAltIcon />}
                iconPosition="end"
              >
                Learn more about configuring virtualization quotas via AAQ
              </Button>
            </div>
          </EmptyState>
        </div>
      </div>
    </PageSection>
  );
};

