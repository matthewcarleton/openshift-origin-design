import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardHeader, CardTitle, Content, PageSection, Title } from '@patternfly/react-core';

export const PodDetailDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const podName = params.get('pod_name') || (() => {
    try {
      return window.localStorage.getItem('pf_var_pod_name');
    } catch {
      return null;
    }
  })();

  return (
    <PageSection>
      <Breadcrumb>
        <BreadcrumbItem to="#" onClick={() => navigate('/core/observe/dashboards-perses')}>
          Dashboards (Perses)
        </BreadcrumbItem>
        <BreadcrumbItem isActive>Pod detail</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ marginTop: '16px' }}>
        <Title headingLevel="h1" size="2xl">
          Pod detail
        </Title>
        <Content>
          <p>
            Showing details for <strong>{podName || '$pod_name (not set)'}</strong>.
          </p>
        </Content>
      </div>

      <div style={{ marginTop: '16px' }}>
        <Card>
          <CardHeader>
            <CardTitle>Pod dashboard</CardTitle>
          </CardHeader>
          <CardBody>
            This is a placeholder “Pod Detail” dashboard. In a real implementation, panels here would be filtered by the
            global variable <strong>$pod_name</strong>.
          </CardBody>
        </Card>
      </div>
    </PageSection>
  );
};

