import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Split,
  SplitItem,
  Content,
  CodeBlock,
  CodeBlockCode,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { getAllIdentityProviders, getUsersByIdentityProvider } from '@app/data/queries';

const IdentityProviderDetail: React.FunctionComponent = () => {
  const { providerName } = useParams<{ providerName: string }>();
  const navigate = useNavigate();
  useDocumentTitle(`ACM RBAC | ${providerName}`);

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Get identity provider from centralized database
  const allProviders = getAllIdentityProviders();
  const currentProvider = allProviders.find(p => p.name === providerName);
  
  // Get users connected through this identity provider
  const connectedUsersFromDB = currentProvider ? getUsersByIdentityProvider(currentProvider.id) : [];
  
  // Transform users from database to component format
  const mockConnectedUsers = connectedUsersFromDB.map((user, index) => ({
    id: index + 1,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: user.email,
    lastLogin: new Date(user.lastLogin).toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
  }));

  // Mock data for the identity provider
  const providerData = {
    name: providerName || 'LDAP',
    type: currentProvider?.type || 'LDAP',
    description: currentProvider?.description || '',
    url: 'ldap://ldap.example.com:389',
    bindDN: 'cn=admin,dc=example,dc=com',
    baseDN: 'dc=example,dc=com',
    lastSync: '2024-01-15 14:30:00 UTC',
    connectedUsers: mockConnectedUsers.length,
    clusters: ['local-cluster', 'dev-cluster', 'staging-cluster'],
    yaml: `apiVersion: config.openshift.io/v1
kind: OAuth
metadata:
  name: cluster
spec:
  identityProviders:
  - name: ${providerName || 'LDAP'}
    type: ${currentProvider?.type || 'LDAP'}
    mappingMethod: claim
    ldap:
      url: ldap://ldap.example.com:389
      bindDN: cn=admin,dc=example,dc=com
      bindPassword:
        name: ldap-secret
      insecure: false
      attributes:
        id:
        - dn
        email:
        - mail
        name:
        - cn
        preferredUsername:
        - uid`,
  };

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const filteredUsers = mockConnectedUsers.filter(user =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="detail-page-header">
        <Breadcrumb className="pf-v6-u-mb-md">
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/user-management/identity-providers'); }}>
            Identity providers
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{providerData.name}</BreadcrumbItem>
        </Breadcrumb>

        <Split hasGutter className="pf-v6-u-mb-md">
          <SplitItem isFilled>
            <div>
              <Title headingLevel="h1" size="2xl">
                {providerData.name}
              </Title>
              <Content component="p" className="pf-v6-u-color-200">
                {providerData.type} - {providerData.description}
              </Content>
            </div>
          </SplitItem>
          <SplitItem>
            <Dropdown
              isOpen={isActionsOpen}
              onSelect={() => setIsActionsOpen(false)}
              onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  isExpanded={isActionsOpen}
                  variant="secondary"
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="sync">Sync now</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownList>
            </Dropdown>
          </SplitItem>
        </Split>

        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Identity provider details tabs"
        >
        <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} aria-label="Details"></Tab>
        <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>} aria-label="YAML"></Tab>
        <Tab eventKey={2} title={<TabTitleText>Connected users</TabTitleText>} aria-label="Connected users"></Tab>
      </Tabs>
      </div>

      <div className="detail-page-content">
        {activeTabKey === 0 && (
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="lg" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                General information
              </Title>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>URL</DescriptionListTerm>
                  <DescriptionListDescription>{providerData.url}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Bind DN</DescriptionListTerm>
                  <DescriptionListDescription>{providerData.bindDN}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Base DN</DescriptionListTerm>
                  <DescriptionListDescription>{providerData.baseDN}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Connected Users</DescriptionListTerm>
                  <DescriptionListDescription>{providerData.connectedUsers}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Applied to Clusters</DescriptionListTerm>
                  <DescriptionListDescription>
                    {providerData.clusters.length > 0 ? (
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        {providerData.clusters.map((cluster, index) => (
                          <FlexItem key={index}>
                            <Label color="blue">{cluster}</Label>
                          </FlexItem>
                        ))}
                      </Flex>
                    ) : (
                      <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No clusters</span>
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Last sync</DescriptionListTerm>
                  <DescriptionListDescription>{providerData.lastSync}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        )}

        {activeTabKey === 1 && (
          <Card>
            <CardBody>
              <CodeBlock>
                <CodeBlockCode>
                  {providerData.yaml}
                </CodeBlockCode>
              </CodeBlock>
            </CardBody>
          </Card>
        )}

        {activeTabKey === 2 && (
          <Card>
            <CardBody>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Search users"
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={filteredUsers.length}
                      page={page}
                      perPage={perPage}
                      onSetPage={onSetPage}
                      onPerPageSelect={onPerPageSelect}
                      variant={PaginationVariant.top}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Connected users table" variant="compact">
                <Thead>
                  <Tr>
                    <Th width={30}>Name</Th>
                    <Th width={25}>Email</Th>
                    <Th width={20}>Username</Th>
                    <Th width={25}>Last Login</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td dataLabel="Name" width={30}>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              backgroundColor: 'var(--pf-t--global--color--brand--default)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'var(--pf-t--global--color--nonstatus--white--default)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                              fontSize: 'var(--pf-t--global--font--size--body--default)'
                            }}>
                              {user.name.charAt(0)}
                            </div>
                          </FlexItem>
                          <FlexItem>
                            <div>
                              <Button variant="link" isInline className="pf-v6-u-p-0">
                                {user.name}
                              </Button>
                              <div className="pf-v6-u-font-size-sm pf-v6-u-color-200">
                                {user.username}
                              </div>
                            </div>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td dataLabel="Email" width={25}>{user.email}</Td>
                      <Td dataLabel="Username" width={20}>{user.username}</Td>
                      <Td dataLabel="Last Login" width={25}>{user.lastLogin}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={filteredUsers.length}
                      page={page}
                      perPage={perPage}
                      onSetPage={onSetPage}
                      onPerPageSelect={onPerPageSelect}
                      variant={PaginationVariant.bottom}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export { IdentityProviderDetail };

