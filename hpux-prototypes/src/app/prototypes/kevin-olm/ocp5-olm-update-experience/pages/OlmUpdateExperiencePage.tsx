import React from 'react';
import {
  Alert,
  AlertVariant,
  PageSection,
  Title,
  Content,
  ContentVariants,
} from '@patternfly/react-core';

/**
 * Landing surface for the OCP 5.x OLM update prototype.
 * Replace or extend this page with screens synced from the upstream repo when available.
 */
export const OlmUpdateExperiencePage: React.FC = () => {
  return (
    <PageSection>
      <Title headingLevel="h1" size="2xl">
        OLM update experience (OCP 5.x)
      </Title>
      <Content
        component={ContentVariants.p}
        style={{ marginTop: 'var(--pf-t--global--spacer--md)', maxWidth: '48rem' }}
      >
        This prototype explores how cluster admins understand and complete platform and operator updates
        when using Operator Lifecycle Manager in the OpenShift 5.x console.
      </Content>

      <Alert
        variant={AlertVariant.info}
        isInline
        title="Upstream source"
        style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}
      >
        <p>
          Design implementation is sourced from{' '}
          <a
            href="https://github.com/kevinhatchoua/ocp5-olm-update-experience"
            target="_blank"
            rel="noopener noreferrer"
          >
            kevinhatchoua/ocp5-olm-update-experience
          </a>
          . Run{' '}
          <code style={{ whiteSpace: 'nowrap' }}>scripts/sync-ocp5-olm-upstream.sh</code> from{' '}
          <code>hpux-prototypes/</code> after cloning that repo locally, then map upstream components into this folder.
        </p>
      </Alert>
    </PageSection>
  );
};
