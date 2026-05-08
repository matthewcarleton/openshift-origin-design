import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { MagicIcon } from '@patternfly/react-icons';
import { FLEET_INSIGHT_CARD_STYLE, FLEET_INSIGHT_ICON_BOX_STYLE, FLEET_INSIGHT_TEXT_WRAPPER_STYLE } from '../data/fleetInsightsConfig';

export const FleetInsightCard: React.FC = () => (
  <div style={FLEET_INSIGHT_CARD_STYLE} role="region" aria-label="Fleet insight">
    <div style={FLEET_INSIGHT_ICON_BOX_STYLE} aria-hidden="true">
      <MagicIcon style={{ width: 20, height: 20 }} />
    </div>
    <div style={FLEET_INSIGHT_TEXT_WRAPPER_STYLE}>
      <span style={{ fontWeight: 600, color: 'var(--pf-t--global--text--color--regular)' }}>
        Fleet Insight:
      </span>{' '}
      <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
        Current pressure on{' '}
        <span style={{ color: '#c9190b', fontWeight: 500 }}>node availability</span> in 12 clusters
        points to a{' '}
        <Button
          variant="link"
          isInline
          style={{
            padding: 0,
            fontSize: 'inherit',
            color: '#6753ac',
            textDecoration: 'underline',
          }}
        >
          VPC-peering bottleneck
        </Button>{' '}
        in{' '}
        <Button
          variant="link"
          isInline
          style={{
            padding: 0,
            fontSize: 'inherit',
            color: '#6753ac',
            textDecoration: 'underline',
          }}
        >
          us-east-1
        </Button>
        .
      </span>
    </div>
  </div>
);
