import * as React from 'react';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Split,
  SplitItem,
  Pagination,
  PaginationVariant,
  Switch,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Flex,
  FlexItem,
  Checkbox,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn, IAction } from '@patternfly/react-table';
import { PlusCircleIcon, FilterIcon, CaretDownIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';
import { getAllIdentityProviders, getUsersByIdentityProvider, getClustersByIdentityProvider } from '@app/data/queries';

// Get identity providers from centralized database
const dbIdentityProviders = getAllIdentityProviders();

// Transform identity providers from database to component format
const mockIdentityProviders = dbIdentityProviders.map((idp, index) => {
  const connectedUsers = getUsersByIdentityProvider(idp.id);
  const connectedClusters = getClustersByIdentityProvider(idp.id);
  
  // Generate last synced times (similar to Groups table)
  const syncTimes = ['2 hours ago', '5 hours ago', '1 day ago', '3 days ago', 'Yesterday', '6 hours ago'];
  const lastSynced = syncTimes[index % syncTimes.length];
  
  return {
    id: index + 1,
    name: idp.name,
    type: idp.type,
    status: idp.status,
    description: idp.description,
    users: connectedUsers.length, // Actual count of users from database
    clusters: connectedClusters.map(c => c.name), // Cluster names from database
    lastSynced,
  };
});

interface IdentityProviderProps {
  showClustersColumn?: boolean;
}

const IdentityProvider: React.FunctionComponent<IdentityProviderProps> = ({ showClustersColumn = true }) => {
  useDocumentTitle('ACM RBAC | Identity Provider');
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newProviderName, setNewProviderName] = React.useState('');
  const [newProviderType, setNewProviderType] = React.useState('OAuth');
  const [clientId, setClientId] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState('');
  const [selectedProviders, setSelectedProviders] = React.useState<Set<number>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = React.useState(false);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [bulkSelectorDropdownOpen, setBulkSelectorDropdownOpen] = React.useState(false);
  const [isConfigureSyncModalOpen, setIsConfigureSyncModalOpen] = React.useState(false);
  const [selectedProviderForSync, setSelectedProviderForSync] = React.useState<number | null>(null);
  const [syncSchedule, setSyncSchedule] = React.useState('0 0 * * *');
  const [syncEnabled, setSyncEnabled] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const providerTypes = ['OAuth', 'OIDC', 'LDAP', 'SAML'];

  const handleCreateProvider = () => {
    setIsCreateModalOpen(true);
  };

  const handleSelectProviderType = (providerType: string) => {
    setIsAddProviderOpen(false);
    
    // Only LDAP is implemented - navigate to the configuration page
    if (providerType === 'LDAP') {
      navigate('/user-management/identity-providers/add/ldap');
    }
    // Other provider types do nothing (not yet implemented)
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setNewProviderName('');
    setNewProviderType('OAuth');
    setClientId('');
    setClientSecret('');
  };

  const handleSaveProvider = () => {
    // In a real application, this would make an API call
    console.log('Creating identity provider:', {
      name: newProviderName,
      type: newProviderType,
      clientId,
      clientSecret,
    });
    handleModalClose();
  };

  const paginatedProviders = mockIdentityProviders.slice((page - 1) * perPage, page * perPage);
  
  const isAllPageSelected = paginatedProviders.length > 0 && paginatedProviders.every(provider => selectedProviders.has(provider.id));

  const handleSelectPage = () => {
    const newSelected = new Set(selectedProviders);
    paginatedProviders.forEach(provider => newSelected.add(provider.id));
    setSelectedProviders(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleSelectAllProviders = () => {
    const newSelected = new Set(mockIdentityProviders.map(provider => provider.id));
    setSelectedProviders(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedProviders(new Set());
  };

  const handleSelectProvider = (providerId: number, isSelecting: boolean) => {
    const newSelected = new Set(selectedProviders);
    if (isSelecting) {
      newSelected.add(providerId);
    } else {
      newSelected.delete(providerId);
    }
    setSelectedProviders(newSelected);
  };

  const handleManualSync = (providerId?: number) => {
    // Simulate manual sync
    if (providerId) {
      console.log('Manually syncing provider:', providerId);
    } else {
      console.log('Manually syncing providers:', Array.from(selectedProviders));
    }
    setIsActionsOpen(false);
    // In a real app, this would trigger an API call
  };

  const handleConfigureSyncModal = (providerId?: number) => {
    setIsActionsOpen(false);
    setSelectedProviderForSync(providerId || null);
    setIsConfigureSyncModalOpen(true);
  };

  const handleSaveAutoSync = () => {
    console.log('Saving auto-sync configuration:', { 
      providerId: selectedProviderForSync, 
      syncSchedule, 
      syncEnabled 
    });
    setIsConfigureSyncModalOpen(false);
    setSelectedProviderForSync(null);
    // In a real app, this would save to backend
  };

  return (
    <>
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent style={{ gap: '8px' }}>
            <ToolbarItem>
              <Dropdown
                isOpen={bulkSelectorDropdownOpen}
                onSelect={() => setBulkSelectorDropdownOpen(false)}
                onOpenChange={(isOpen: boolean) => setBulkSelectorDropdownOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => {
                      if (selectedProviders.size > 0) {
                        handleDeselectAll();
                      } else {
                        setBulkSelectorDropdownOpen(!bulkSelectorDropdownOpen);
                      }
                    }}
                    variant="plain"
                    style={{
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)',
                      padding: '6px 8px',
                      minWidth: 'auto',
                    }}
                  >
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Checkbox
                          isChecked={isAllPageSelected}
                          onChange={(event, checked) => {
                            event.stopPropagation();
                            if (checked) {
                              handleSelectPage();
                            } else {
                              handleDeselectAll();
                            }
                          }}
                          aria-label="Select all"
                          id="select-all-providers-checkbox"
                        />
                      </FlexItem>
                      <FlexItem>
                        <CaretDownIcon />
                      </FlexItem>
                    </Flex>
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="select-page" onClick={handleSelectPage}>
                    Select page ({paginatedProviders.length} items)
                  </DropdownItem>
                  <DropdownItem key="select-all" onClick={handleSelectAllProviders}>
                    Select all ({mockIdentityProviders.length} items)
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isFilterOpen}
                onSelect={() => setIsFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="default"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    isExpanded={isFilterOpen}
                  >
                    <FilterIcon /> Identity provider
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="all">All providers</DropdownItem>
                  <DropdownItem key="oauth">OAuth</DropdownItem>
                  <DropdownItem key="oidc">OIDC</DropdownItem>
                  <DropdownItem key="ldap">LDAP</DropdownItem>
                  <DropdownItem key="saml">SAML</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search identity providers"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isAddProviderOpen}
                onSelect={() => setIsAddProviderOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsAddProviderOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsAddProviderOpen(!isAddProviderOpen)}
                    isExpanded={isAddProviderOpen}
                    variant="primary"
                  >
                    Add Identity provider
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="basic-auth" onClick={() => handleSelectProviderType('Basic Authentication')}>
                    Basic Authentication
                  </DropdownItem>
                  <DropdownItem key="github" onClick={() => handleSelectProviderType('GitHub')}>
                    GitHub
                  </DropdownItem>
                  <DropdownItem key="gitlab" onClick={() => handleSelectProviderType('GitLab')}>
                    GitLab
                  </DropdownItem>
                  <DropdownItem key="google" onClick={() => handleSelectProviderType('Google')}>
                    Google
                  </DropdownItem>
                  <DropdownItem key="htpasswd" onClick={() => handleSelectProviderType('HTPasswd')}>
                    HTPasswd
                  </DropdownItem>
                  <DropdownItem key="keystone" onClick={() => handleSelectProviderType('Keystone')}>
                    Keystone
                  </DropdownItem>
                  <DropdownItem key="ldap" onClick={() => handleSelectProviderType('LDAP')}>
                    LDAP
                  </DropdownItem>
                  <DropdownItem key="openid" onClick={() => handleSelectProviderType('OpenID Connect')}>
                    OpenID Connect
                  </DropdownItem>
                  <DropdownItem key="request-header" onClick={() => handleSelectProviderType('Request Header')}>
                    Request Header
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isActionsOpen}
                onSelect={() => setIsActionsOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsActionsOpen(!isActionsOpen)}
                    isExpanded={isActionsOpen}
                    isDisabled={selectedProviders.size === 0}
                  >
                    Actions
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="manual-sync" onClick={handleManualSync}>
                    Manually sync
                  </DropdownItem>
                  <DropdownItem key="configure-sync" onClick={handleConfigureSyncModal}>
                    Configure automatic sync
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={mockIdentityProviders.length}
                perPage={perPage}
                page={page}
                onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                onPerPageSelect={(_event, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
                variant={PaginationVariant.top}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Identity providers table" variant="compact">
          <Thead>
            <Tr>
              <Th />
              <Th width={showClustersColumn ? 20 : 25}>Identity provider</Th>
              <Th width={showClustersColumn ? 10 : 15}>Type</Th>
              <Th width={showClustersColumn ? 10 : 15}>Status</Th>
              <Th width={showClustersColumn ? 10 : 15}>Connected Users</Th>
              <Th width={showClustersColumn ? 15 : 20}>Last Synced</Th>
              {showClustersColumn && <Th width={25}>Clusters</Th>}
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProviders.map((provider) => (
              <Tr key={provider.id}>
                <Td
                  select={{
                    rowIndex: provider.id,
                    onSelect: (_event, isSelecting) => handleSelectProvider(provider.id, isSelecting),
                    isSelected: selectedProviders.has(provider.id),
                  }}
                />
                <Td dataLabel="Identity provider" width={showClustersColumn ? 20 : 25} style={{ textAlign: 'left' }}>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => navigate(`/user-management/identity-providers/${provider.name}`)}
                    style={{ paddingLeft: 0 }}
                  >
                    {provider.name}
                  </Button>
                </Td>
                <Td dataLabel="Type" width={showClustersColumn ? 10 : 15}>
                  <Label color="blue">{provider.type}</Label>
                </Td>
                <Td dataLabel="Status" width={showClustersColumn ? 10 : 15}>
                  <Label color={provider.status === 'Active' ? 'green' : 'grey'}>{provider.status}</Label>
                </Td>
                <Td dataLabel="Connected Users" width={showClustersColumn ? 10 : 15}>{provider.users}</Td>
                <Td dataLabel="Last Synced" width={showClustersColumn ? 15 : 20}>{provider.lastSynced}</Td>
                {showClustersColumn && (
                  <Td dataLabel="Clusters" width={25}>
                    {provider.clusters.length > 0 ? (
                      <Split hasGutter>
                        {provider.clusters.slice(0, 2).map((cluster, index) => (
                          <SplitItem key={index}>
                            <Label isCompact color="blue">{cluster}</Label>
                          </SplitItem>
                        ))}
                        {provider.clusters.length > 2 && (
                          <SplitItem>
                            <Label isCompact>+{provider.clusters.length - 2} more</Label>
                          </SplitItem>
                        )}
                      </Split>
                    ) : (
                      <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No clusters</span>
                    )}
                  </Td>
                )}
                <Td isActionCell>
                  <ActionsColumn
                    items={[
                      {
                        title: 'Manually sync',
                        onClick: () => handleManualSync(provider.id),
                      },
                      {
                        title: 'Configure automatic sync',
                        onClick: () => handleConfigureSyncModal(provider.id),
                      },
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div style={{ padding: '16px' }}>
          <Pagination
            itemCount={mockIdentityProviders.length}
            perPage={perPage}
            page={page}
            onSetPage={(_event, pageNumber) => setPage(pageNumber)}
            onPerPageSelect={(_event, newPerPage) => {
              setPerPage(newPerPage);
              setPage(1);
            }}
            variant={PaginationVariant.bottom}
          />
        </div>
      </div>

      <Modal
        variant={ModalVariant.medium}
        title="Add Identity Provider"
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
      >
        <Form>
          <FormGroup label="Provider Name" isRequired fieldId="provider-name">
            <TextInput
              isRequired
              type="text"
              id="provider-name"
              name="provider-name"
              value={newProviderName}
              onChange={(_event, value) => setNewProviderName(value)}
            />
          </FormGroup>
          <FormGroup label="Provider Type" isRequired fieldId="provider-type">
            <FormSelect
              value={newProviderType}
              onChange={(_event, value) => setNewProviderType(value)}
              id="provider-type"
              name="provider-type"
            >
              {providerTypes.map((type, index) => (
                <FormSelectOption key={index} value={type} label={type} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Client ID" isRequired fieldId="client-id">
            <TextInput
              isRequired
              type="text"
              id="client-id"
              name="client-id"
              value={clientId}
              onChange={(_event, value) => setClientId(value)}
            />
          </FormGroup>
          <FormGroup label="Client Secret" isRequired fieldId="client-secret">
            <TextInput
              isRequired
              type="password"
              id="client-secret"
              name="client-secret"
              value={clientSecret}
              onChange={(_event, value) => setClientSecret(value)}
            />
          </FormGroup>
        </Form>
        <div className="pf-v6-u-mt-md">
          <Button variant="primary" onClick={handleSaveProvider}>
            Add Provider
          </Button>{' '}
          <Button variant="link" onClick={handleModalClose}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        variant={ModalVariant.medium}
        title="Configure automatic sync"
        isOpen={isConfigureSyncModalOpen}
        onClose={() => setIsConfigureSyncModalOpen(false)}
      >
        <Form>
          <FormGroup label="Enable automatic sync" fieldId="sync-enabled">
            <Switch
              id="sync-enabled"
              label={syncEnabled ? "Enabled" : "Disabled"}
              isChecked={syncEnabled}
              onChange={(_event, checked) => setSyncEnabled(checked)}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  When enabled, the identity provider will automatically sync on the specified schedule.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          
          <FormGroup label="Sync schedule (Cron expression)" isRequired fieldId="sync-schedule">
            <TextInput
              isRequired
              type="text"
              id="sync-schedule"
              name="sync-schedule"
              value={syncSchedule}
              onChange={(_event, value) => setSyncSchedule(value)}
              placeholder="0 0 * * *"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  Enter a cron expression to define when the sync should occur. Example: "0 0 * * *" runs daily at midnight.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          <FormGroup label="Common examples" fieldId="examples">
            <FormHelperText>
              <HelperText>
                <HelperTextItem>• <strong>0 * * * *</strong> - Every hour</HelperTextItem>
                <HelperTextItem>• <strong>0 0 * * *</strong> - Daily at midnight</HelperTextItem>
                <HelperTextItem>• <strong>0 0 * * 0</strong> - Weekly on Sunday at midnight</HelperTextItem>
                <HelperTextItem>• <strong>0 0 1 * *</strong> - Monthly on the 1st at midnight</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
        <div className="pf-v6-u-mt-md">
          <Button variant="primary" onClick={handleSaveAutoSync}>
            Save configuration
          </Button>{' '}
          <Button variant="link" onClick={() => setIsConfigureSyncModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export { IdentityProvider };

