/**
 * Create silence rule — full-page form (prototype).
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Content, Title } from '@patternfly/react-core';
import { SilenceRuleForm } from '../components/SilenceRuleForm';

/** Page edge padding (all sides) */
const PAGE_PAD = 'var(--pf-v5-global--spacer--lg, 24px)';

const CreateSilencePage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const goToAlertingManagement = () => {
    navigate('/observe/alerting?tab=management&subtab=silence-rules');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        padding: PAGE_PAD,
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
      }}
    >
      <div
        style={{
          paddingBottom: 'var(--pf-t--global--spacer--md)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          borderBottom: '1px solid var(--pf-t--global--border--color--default)',
        }}
      >
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem>Observe</BreadcrumbItem>
          <BreadcrumbItem>Multi-cluster alerting</BreadcrumbItem>
          <BreadcrumbItem component="button" onClick={goToAlertingManagement}>
            Management
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Create silence</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
          <Title headingLevel="h1" size="2xl">
            Create silence rule
          </Title>
          <Content
            component="p"
            style={{
              marginTop: 'var(--pf-t--global--spacer--sm)',
              color: 'var(--pf-t--global--text--color--subtle)',
            }}
          >
            Silences temporarily mute alerts based on a set of label selectors that you define. Notifications will not be sent for alerts that match all the listed values or regular expressions.
          </Content>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          paddingTop: 'var(--pf-t--global--spacer--md)',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        }}
      >
        <SilenceRuleForm
          mode="create"
          showIntroText={false}
          onCancel={goToAlertingManagement}
          onSubmit={goToAlertingManagement}
        />
      </div>
    </div>
  );
};

export { CreateSilencePage };
