import React from 'react';
import { PageSection, Title, Tabs, Tab, TabTitleText, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';

interface DetailPageLayoutProps {
  title: string;
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;
  activeTab: string;
  onTabChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => void;
  tabs: Array<{
    key: string;
    title: string;
    content: React.ReactNode;
  }>;
}

export const DetailPageLayout: React.FunctionComponent<DetailPageLayoutProps> = ({
  title,
  breadcrumbs,
  activeTab,
  onTabChange,
  tabs
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header section - white background with breadcrumbs, title and tabs */}
      <div className="page-header-section">
        <Breadcrumb>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem
              key={index}
              to={crumb.path}
              onClick={crumb.path ? () => navigate(crumb.path!) : undefined}
              isActive={index === breadcrumbs.length - 1}
            >
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl">
          {title}
        </Title>
        
        <Tabs
          activeKey={activeTab}
          onSelect={onTabChange}
          aria-label="Detail page tabs"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              eventKey={tab.key}
              title={<TabTitleText>{tab.title}</TabTitleText>}
            />
          ))}
        </Tabs>
      </div>

      {/* Content area - grey background */}
      <div className="page-content-section">
        {tabs.find(tab => tab.key === activeTab)?.content}
      </div>
    </>
  );
};
