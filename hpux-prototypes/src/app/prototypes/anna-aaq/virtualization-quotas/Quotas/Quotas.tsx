import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Card,
  CardBody,
  Grid,
  GridItem,
  Content,
  Progress,
  ProgressSize,
  Label,
  Flex,
  FlexItem,
  Pagination,
  Modal,
  ModalVariant,
  Checkbox,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { 
  PlusIcon, 
  FilterIcon, 
  ExternalLinkAltIcon, 
  CheckCircleIcon,
  ArrowsAltVIcon,
  CaretDownIcon,
  EllipsisVIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts/victory';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useQuotas } from '@app/shared/contexts/QuotasContext';

export const Quotas: React.FC = () => {
  useDocumentTitle('Quotas');
  const navigate = useNavigate();
  const location = useLocation();
  const { quotas: mockQuotas, deleteQuota } = useQuotas();
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isScopeOpen, setIsScopeOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [quotaToDelete, setQuotaToDelete] = React.useState<{ id: number; name: string } | null>(null);
  const [selectedQuotas, setSelectedQuotas] = React.useState<Set<number>>(new Set());
  const [bulkSelectorDropdownOpen, setBulkSelectorDropdownOpen] = React.useState(false);
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [newlyCreatedQuotaName, setNewlyCreatedQuotaName] = React.useState<string | null>(null);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = React.useState(false);
  const [editedQuotaName, setEditedQuotaName] = React.useState<string | null>(null);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = React.useState(false);
  const [deletedQuotaName, setDeletedQuotaName] = React.useState<string | null>(null);

  const filteredQuotas = mockQuotas.filter((quota) =>
    quota.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    quota.scope.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Check for newly created or edited quota from navigation state
  React.useEffect(() => {
    const state = location.state as any;
    
    // Handle new quota creation
    if (state?.newQuota && state?.showSuccessAlert) {
      setNewlyCreatedQuotaName(state.newQuota.name);
      setShowSuccessAlert(true);
      
      // Auto-dismiss alert after 8 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 8000);
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: null });
    }
    
    // Handle quota edit
    if (state?.editedQuota && state?.showEditSuccessAlert) {
      setEditedQuotaName(state.editedQuota.name);
      setShowEditSuccessAlert(true);
      
      // Auto-dismiss alert after 8 seconds
      setTimeout(() => {
        setShowEditSuccessAlert(false);
      }, 8000);
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const handleDeleteClick = (id: number, name: string) => {
    setQuotaToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quotaToDelete) {
      deleteQuota(quotaToDelete.id);
      setDeletedQuotaName(quotaToDelete.name);
      setShowDeleteSuccessAlert(true);
      
      // Auto-dismiss alert after 8 seconds
      setTimeout(() => {
        setShowDeleteSuccessAlert(false);
      }, 8000);
    }
    setIsDeleteModalOpen(false);
    setQuotaToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setQuotaToDelete(null);
  };

  // Pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedQuotas = filteredQuotas.slice(startIndex, endIndex);

  // Selection handlers
  const isQuotaSelected = (quotaId: number) => selectedQuotas.has(quotaId);

  const handleSelectQuota = (quotaId: number, isSelecting: boolean) => {
    const newSelected = new Set(selectedQuotas);
    if (isSelecting) {
      newSelected.add(quotaId);
    } else {
      newSelected.delete(quotaId);
    }
    setSelectedQuotas(newSelected);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedQuotas);
    paginatedQuotas.forEach(quota => newSelected.add(quota.id));
    setSelectedQuotas(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleSelectAll = () => {
    const newSelected = new Set(mockQuotas.map(quota => quota.id));
    setSelectedQuotas(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedQuotas(new Set());
  };

  const isAllPageSelected = paginatedQuotas.length > 0 && paginatedQuotas.every(quota => selectedQuotas.has(quota.id));

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

  // Calculate dynamic data from actual quotas
  const clusterScopedQuotas = mockQuotas.filter(q => q.scope === 'Cluster-scoped').length;
  const namespaceScopedQuotas = mockQuotas.filter(q => q.scope !== 'Cluster-scoped').length;
  const totalQuotas = mockQuotas.length;

  // Calculate CPU totals from all quotas
  const cpuTotal = mockQuotas.reduce((sum, quota) => sum + quota.cpuTotal, 0);
  const cpuUsed = mockQuotas.reduce((sum, quota) => sum + quota.cpuUsed, 0);
  const cpuAvailable = cpuTotal - cpuUsed;
  const cpuPercentage = cpuTotal > 0 ? Math.round((cpuUsed / cpuTotal) * 100) : 0;

  // Calculate Memory totals from all quotas
  const memoryTotal = mockQuotas.reduce((sum, quota) => sum + quota.memoryTotal, 0);
  const memoryUsed = mockQuotas.reduce((sum, quota) => sum + quota.memoryUsed, 0);
  const memoryAvailable = memoryTotal - memoryUsed;

  // Calculate VM totals from all quotas
  const vmTotal = mockQuotas.reduce((sum, quota) => sum + quota.vmTotal, 0);
  const vmUsed = mockQuotas.reduce((sum, quota) => sum + quota.vmUsed, 0);
  const vmAvailable = vmTotal - vmUsed;

  return (
    <>
      {/* Success Alerts */}
      <AlertGroup isToast isLiveRegion>
        {showSuccessAlert && (
          <Alert
            variant="success"
            title={`Virtualization quota "${newlyCreatedQuotaName}" created successfully`}
            timeout={8000}
            onTimeout={() => setShowSuccessAlert(false)}
            actionClose={<AlertActionCloseButton onClose={() => setShowSuccessAlert(false)} />}
          />
        )}
        {showEditSuccessAlert && (
          <Alert
            variant="info"
            title={`Virtualization quota "${editedQuotaName}" updated successfully`}
            timeout={8000}
            onTimeout={() => setShowEditSuccessAlert(false)}
            actionClose={<AlertActionCloseButton onClose={() => setShowEditSuccessAlert(false)} />}
          />
        )}
        {showDeleteSuccessAlert && (
          <Alert
            variant="success"
            title={`Virtualization quota "${deletedQuotaName}" deleted successfully`}
            timeout={8000}
            onTimeout={() => setShowDeleteSuccessAlert(false)}
            actionClose={<AlertActionCloseButton onClose={() => setShowDeleteSuccessAlert(false)} />}
          />
        )}
      </AlertGroup>

      <div className="quotas-page-container">
        <div className="page-header-section">
          {/* Header */}
          <div>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: '8px' }}>
              Virtualization quotas
            </Title>
          <Content component="p" style={{ color: '#6a6e73', marginBottom: '8px' }}>
            View and manage virtualization-specific resource quotas configured through the Application Aware Quota (AAQ) Operator.
          </Content>
          <a href="#" style={{ color: '#0066cc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Learn more about configuring virtualization quotas via AAQ <ExternalLinkAltIcon />
          </a>
        </div>
      </div>

      <div className="page-content-section">

        {/* Stats Cards */}
        <Grid hasGutter style={{ marginBottom: '24px' }}>
          {/* Total quotas */}
          <GridItem span={3}>
            <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
              <CardBody>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                    Total quotas
                  </Title>
                  <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                    <ChartDonut
                      ariaDesc="Total quotas breakdown"
                      ariaTitle="Total quotas"
                      constrainToVisibleArea={true}
                      data={[
                        { x: 'Cluster-scoped', y: clusterScopedQuotas },
                        { x: 'Namespace-scoped', y: namespaceScopedQuotas }
                      ]}
                      labels={({ datum }) => `${datum.x}: ${datum.y}`}
                      legendData={[
                        { name: `Cluster-scoped: ${clusterScopedQuotas}` },
                        { name: `Namespace-scoped: ${namespaceScopedQuotas}` }
                      ]}
                      legendOrientation="vertical"
                      legendPosition="bottom"
                      padding={{
                        bottom: 85,
                        left: 20,
                        right: 20,
                        top: 20
                      }}
                      subTitle="total quotas"
                      title={totalQuotas.toString()}
                      width={230}
                      height={250}
                      colorScale={['#0066cc', '#73bcf7']}
                      style={{
                        labels: {
                          fontSize: 18
                        }
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* CPU quota allocations */}
          <GridItem span={3}>
            <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
              <CardBody>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                    CPU quota allocations
                  </Title>
                  <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                    <ChartDonut
                      ariaDesc="CPU quota allocations breakdown"
                      ariaTitle="CPU quota allocations"
                      constrainToVisibleArea={true}
                      data={[
                        { x: 'Used', y: cpuUsed },
                        { x: 'Available', y: cpuAvailable }
                      ]}
                      labels={({ datum }) => `${datum.y} cores ${datum.x.toLowerCase()}`}
                      legendData={[
                        { name: `${cpuUsed} cores used` },
                        { name: `${cpuAvailable} cores available` }
                      ]}
                      legendOrientation="vertical"
                      legendPosition="bottom"
                      padding={{
                        bottom: 85,
                        left: 20,
                        right: 20,
                        top: 20
                      }}
                      subTitle={`of ${cpuTotal} cores`}
                      title={`${cpuPercentage}%`}
                      width={230}
                      height={250}
                      colorScale={['#0066cc', '#73bcf7']}
                      style={{
                        labels: {
                          fontSize: 18
                        }
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Memory allocation */}
          <GridItem span={3}>
            <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
              <CardBody>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                    Memory allocation
                  </Title>
                  <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                    <ChartDonut
                      ariaDesc="Memory allocation breakdown"
                      ariaTitle="Memory allocation"
                      constrainToVisibleArea={true}
                      data={[
                        { x: 'Used', y: memoryUsed },
                        { x: 'Available', y: memoryAvailable }
                      ]}
                      labels={({ datum }) => `${datum.y} GiB ${datum.x.toLowerCase()}`}
                      legendData={[
                        { name: `${memoryUsed} GiB used` },
                        { name: `${memoryAvailable} GiB available` }
                      ]}
                      legendOrientation="vertical"
                      legendPosition="bottom"
                      padding={{
                        bottom: 85,
                        left: 20,
                        right: 20,
                        top: 20
                      }}
                      subTitle={`of ${memoryTotal} GiB`}
                      title={`${memoryUsed} GiB`}
                      width={230}
                      height={250}
                      colorScale={['#ec7a08', '#f4b678']}
                      style={{
                        labels: {
                          fontSize: 18
                        }
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* VM count */}
          <GridItem span={3}>
            <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
              <CardBody>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                    VM count
                  </Title>
                  <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                    <ChartDonut
                      ariaDesc="VM count breakdown"
                      ariaTitle="VM count"
                      constrainToVisibleArea={true}
                      data={[
                        { x: 'Used', y: vmUsed },
                        { x: 'Available', y: vmAvailable }
                      ]}
                      labels={({ datum }) => `${datum.y} VMs ${datum.x.toLowerCase()}`}
                      legendData={[
                        { name: `${vmUsed} VMs used` },
                        { name: `${vmAvailable} VMs available` }
                      ]}
                      legendOrientation="vertical"
                      legendPosition="bottom"
                      padding={{
                        bottom: 85,
                        left: 20,
                        right: 20,
                        top: 20
                      }}
                      subTitle={`of ${vmTotal} VMs`}
                      title={`${vmUsed}`}
                      width={230}
                      height={250}
                      colorScale={['#c9190b', '#f4b678']}
                      style={{
                        labels: {
                          fontSize: 18
                        }
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Toolbar and Table */}
        <Card className="table-content-card">
          <CardBody>
            <Toolbar style={{ padding: '0 0 16px 0' }}>
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
                          if (selectedQuotas.size > 0) {
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
                              id="select-all-quotas-checkbox"
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
                      <DropdownItem key="select-none" onClick={handleDeselectAll}>
                        Select none (0 items)
                      </DropdownItem>
                      <DropdownItem key="select-page" onClick={handleSelectPage}>
                        Select page ({paginatedQuotas.length} items)
                      </DropdownItem>
                      <DropdownItem key="select-all" onClick={handleSelectAll}>
                        Select all ({mockQuotas.length} items)
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
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        icon={<FilterIcon />}
                      >
                        Filter
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>All quotas</DropdownItem>
                      <DropdownItem>Active only</DropdownItem>
                      <DropdownItem>Inactive only</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isScopeOpen}
                    onSelect={() => setIsScopeOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsScopeOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsScopeOpen(!isScopeOpen)}
                      >
                        Scope
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>All scopes</DropdownItem>
                      <DropdownItem>Cluster-scoped</DropdownItem>
                      <DropdownItem>Namespace-scoped</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <SearchInput
                    placeholder="Search"
                    value={searchValue}
                    onChange={(_event, value) => setSearchValue(value)}
                    onClear={() => setSearchValue('')}
                    style={{ width: '300px' }}
                  />
                </ToolbarItem>
                <ToolbarItem variant="separator" />
                <ToolbarItem>
                  <Button variant="primary" onClick={() => navigate('/core/virtualization/quotas/create')}>
                    Create quota
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isKebabOpen}
                    onSelect={() => setIsKebabOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsKebabOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsKebabOpen(!isKebabOpen)}
                        variant="plain"
                        aria-label="Actions"
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem 
                        key="delete" 
                        isDisabled={selectedQuotas.size === 0}
                        onClick={() => {
                          if (selectedQuotas.size > 0) {
                            console.log('Delete selected quotas:', Array.from(selectedQuotas));
                            // TODO: Implement bulk delete functionality
                          }
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={filteredQuotas.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    variant="top"
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th />
                  <Th>
                    Name <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Th>
                  <Th>
                    Scope <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} /> <QuestionCircleIcon style={{ marginLeft: '4px', fontSize: '14px', color: '#6a6e73' }} />
                  </Th>
                  <Th>
                    CPU limits <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Th>
                  <Th>
                    Memory limits <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Th>
                  <Th>
                    VM limits <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Th>
                  <Th>
                    Status <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Th>
                  <Th>
                    Created <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedQuotas.map((quota) => {
                  const cpuPercentage = (quota.cpuUsed / quota.cpuTotal) * 100;
                  const memoryPercentage = (quota.memoryUsed / quota.memoryTotal) * 100;
                  const vmPercentage = (quota.vmUsed / quota.vmTotal) * 100;

                  return (
                    <Tr key={quota.id}>
                      <Td
                        select={{
                          rowIndex: quota.id,
                          onSelect: (_event, isSelecting) => handleSelectQuota(quota.id, isSelecting),
                          isSelected: isQuotaSelected(quota.id),
                        }}
                      />
                      <Td>
                        <Link to={`/core/virtualization/quotas/${quota.name}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                          {quota.name}
                        </Link>
                      </Td>
                      <Td>{quota.scope}</Td>
                      <Td>
                        <div style={{ width: '120px' }}>
                          <Progress
                            value={cpuPercentage}
                            size={ProgressSize.sm}
                            style={{ 
                              '--pf-v5-c-progress__bar--BackgroundColor': '#f0ab00',
                            } as React.CSSProperties}
                          />
                          <div style={{ marginTop: '4px', fontSize: '12px' }}>
                            {quota.cpuUsed}/{quota.cpuTotal} cores
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <div style={{ width: '120px' }}>
                          <Progress
                            value={memoryPercentage}
                            size={ProgressSize.sm}
                            style={{ 
                              '--pf-v5-c-progress__bar--BackgroundColor': '#3e8635',
                            } as React.CSSProperties}
                          />
                          <div style={{ marginTop: '4px', fontSize: '12px' }}>
                            {quota.memoryUsed}/{quota.memoryTotal} GiB
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <div style={{ width: '120px' }}>
                          <Progress
                            value={vmPercentage}
                            size={ProgressSize.sm}
                            style={{ 
                              '--pf-v5-c-progress__bar--BackgroundColor': '#c9190b',
                            } as React.CSSProperties}
                          />
                          <div style={{ marginTop: '4px', fontSize: '12px' }}>
                            {quota.vmUsed}/{quota.vmTotal} VMs
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Label color="green" icon={<CheckCircleIcon />}>
                          {quota.status}
                        </Label>
                      </Td>
                      <Td>{quota.created}</Td>
                      <Td>
                        <ActionsColumn
                          items={[
                            {
                              title: 'Edit',
                              onClick: () => navigate('/core/virtualization/quotas/create', { 
                                state: { 
                                  editMode: true, 
                                  quotaData: {
                                    name: quota.name,
                                    scope: quota.scope,
                                    project: quota.scope,
                                    labelSelector: 'No labels',
                                    cpuTotal: quota.cpuTotal,
                                    memoryTotal: quota.memoryTotal,
                                    vmTotal: quota.vmTotal,
                                  }
                                } 
                              }),
                            },
                            {
                              title: 'Delete',
                              onClick: () => handleDeleteClick(quota.id, quota.name),
                            },
                          ]}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            {/* Bottom pagination */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}>
              <Pagination
                itemCount={filteredQuotas.length}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                variant="bottom"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal
        variant={ModalVariant.medium}
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        aria-label="Delete quota confirmation"
      >
        <div style={{ padding: '24px' }}>
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            Delete quota?
          </Title>
          
          <Content component="p" style={{ 
            marginBottom: 'var(--pf-t--global--spacer--lg)',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Are you sure you want to delete quota <strong>{quotaToDelete?.name}</strong>? This action cannot be undone.
          </Content>

          <div style={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px'
          }}>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </>
  );
};

