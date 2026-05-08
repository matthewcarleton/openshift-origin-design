import React, { useState } from 'react';
import {
  Title,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import Overview from './Overview';
import TopConsumers from './TopConsumers';
import Migrations from './Migrations';
import Settings from './Settings';

const Virtualization: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div 
          className="page-header-section"
          style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderBottom: '1px solid #e0e0e0',
            margin: 0,
            width: '100%',
            maxWidth: '100%',
          }}
        >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title headingLevel="h1" size="lg">
            Virtualization
          </Title>
          <a
            href="#"
            style={{
              color: '#0066cc',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Download the virtctl command-line utility
            <ExternalLinkAltIcon style={{ fontSize: '12px' }} />
          </a>
        </div>

        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Virtualization tabs" style={{ marginTop: '16px' }}>
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} aria-label="Overview tab" />
          <Tab eventKey={1} title={<TabTitleText>Top consumers</TabTitleText>} aria-label="Top consumers tab" />
          <Tab eventKey={2} title={<TabTitleText>Migrations</TabTitleText>} aria-label="Migrations tab" />
          <Tab eventKey={3} title={<TabTitleText>Settings</TabTitleText>} aria-label="Settings tab" />
        </Tabs>
        </div>
      </div>

      <div 
        className="page-content-section"
        style={{
          backgroundColor: 'transparent',
          padding: 0,
          margin: 0,
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {activeTabKey === 0 && <Overview />}
        {activeTabKey === 1 && <TopConsumers />}
        {activeTabKey === 2 && <Migrations />}
        {activeTabKey === 3 && <Settings />}
      </div>
    </div>
  );
};

export default Virtualization;

