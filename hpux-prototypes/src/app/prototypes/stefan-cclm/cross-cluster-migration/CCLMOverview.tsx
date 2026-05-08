import React from 'react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardBody,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

export const CCLMOverview: React.FC = () => {
  useDocumentTitle('Cross Cluster Live Migration');

  return (
    <div className="page-container">
      <PageSection style={{ background: '#ffffff', padding: '24px' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '16px' }}>
          Cross Cluster Live Migration
        </Title>
        <Content component="p" style={{ color: '#6a6e73', marginBottom: '32px' }}>
          Seamlessly migrate virtual machines across clusters with zero downtime
        </Content>

        <Grid hasGutter>
          <GridItem span={12}>
            <Card isFullHeight>
              <CardBody>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                  Overview
                </Title>
                <Content component="p" style={{ marginBottom: '16px' }}>
                  Cross cluster live migration enables you to move running virtual machines between different
                  OpenShift clusters without interruption to workloads. This feature is essential for:
                </Content>
                <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                  <li>Load balancing across clusters</li>
                  <li>Cluster maintenance and upgrades</li>
                  <li>Disaster recovery scenarios</li>
                  <li>Geographic relocation of workloads</li>
                </ul>
                <Content component="p" style={{ color: '#6a6e73', fontSize: '14px' }}>
                  This prototype is under development. More features coming soon.
                </Content>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </div>
  );
};

