import React, { useState } from 'react';
import { Title, Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import { UsersTableEmpty } from '../../Identities/UsersTableEmpty';
import { GroupsTableEmpty } from '../../Identities/GroupsTableEmpty';
import { ServiceAccountsTableEmpty } from '../../Identities/ServiceAccountsTableEmpty';

export const IdentitiesPage: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const renderTabContent = () => {
    switch (activeTabKey) {
      case 0:
        return <GroupsTableEmpty />;
      case 1:
        return <UsersTableEmpty />;
      case 2:
        return <ServiceAccountsTableEmpty />;
      default:
        return <GroupsTableEmpty />;
    }
  };

  return (
    <div className="identities-page-container">
      <div className="page-header-section">
        <Title headingLevel="h1" size="lg">
          Identities
        </Title>
        <div style={{ marginTop: '8px', marginBottom: '16px', color: '#6a6e73' }}>
          Manage all identities including users, groups, and service accounts in one place. Assign access individually or by group, where users automatically inherit their group's permissions.
        </div>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Identity tabs">
          <Tab eventKey={0} title={<TabTitleText>Groups</TabTitleText>} aria-label="Groups tab" />
          <Tab eventKey={1} title={<TabTitleText>Users</TabTitleText>} aria-label="Users tab" />
          <Tab eventKey={2} title={<TabTitleText>Service accounts</TabTitleText>} aria-label="Service accounts tab" />
        </Tabs>
      </div>
      
      <div className="page-content-section">
        {renderTabContent()}
      </div>
    </div>
  );
};

