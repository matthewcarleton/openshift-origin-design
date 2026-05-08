import React from 'react';
import { PageSection, Title, Tabs, Tab, TabTitleText } from '@patternfly/react-core';

interface PageLayoutProps {
  title: string;
  activeTab: string;
  onTabChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => void;
  tabs: Array<{
    key: string;
    title: string;
    content: React.ReactNode;
  }>;
}

export const PageLayout: React.FunctionComponent<PageLayoutProps> = ({
  title,
  activeTab,
  onTabChange,
  tabs
}) => {
  return (
    <>
      {/* Header section - white background with title and tabs */}
      <div className="page-header-section">
        <Title headingLevel="h1" size="2xl">
          {title}
        </Title>
        <Tabs
          activeKey={activeTab}
          onSelect={onTabChange}
          aria-label="Page tabs"
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
