import React from 'react';
import { Content, PageSection } from '@patternfly/react-core';
import { useActivePerspective } from '@app/shared/contexts/ActivePerspectiveContext';
import { SummitFleetAlertingPage } from './alerting-fleet-copy/SummitFleetAlertingPage';
import { SummitFleetCreateAlertRulePage } from './alerting-fleet-copy/SummitFleetCreateAlertRulePage';
import { SummitFleetCreateSilencePage } from './alerting-fleet-copy/SummitFleetCreateSilencePage';

/** Renders the forked Multi-cluster Alerting v2 UI in both Fleet management and Core platforms. */
export const AlertingFleetManagementGate: React.FC = () => {
  return <SummitFleetAlertingPage />;
};

export const CreateAlertRuleFleetManagementGate: React.FC = () => {
  const { activePerspective } = useActivePerspective();
  if (activePerspective === 'Fleet management') {
    return <SummitFleetCreateAlertRulePage />;
  }
  return (
    <PageSection>
      <Content component="p">
        Create alert rule is available in the <strong>Fleet management</strong> perspective. Switch perspective in the
        sidebar, then use Alerting → Create a new alert rule.
      </Content>
    </PageSection>
  );
};

export const CreateSilenceFleetManagementGate: React.FC = () => {
  const { activePerspective } = useActivePerspective();
  if (activePerspective === 'Fleet management') {
    return <SummitFleetCreateSilencePage />;
  }
  return (
    <PageSection>
      <Content component="p">
        Create silence is available in the <strong>Fleet management</strong> perspective. Switch perspective in the
        sidebar, then use Alerting → Management → Silence rules → Create silence.
      </Content>
    </PageSection>
  );
};
