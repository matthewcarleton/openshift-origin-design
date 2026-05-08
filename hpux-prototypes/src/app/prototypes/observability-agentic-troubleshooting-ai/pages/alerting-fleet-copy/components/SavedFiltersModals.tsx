import * as React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Content,
  FormGroup,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Checkbox,
  Label,
  EmptyState,
  EmptyStateBody,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListControl,
  DataListItemCells,
  DataListCell,
  Tooltip,
} from '@patternfly/react-core';
import {
  InfoCircleIcon,
  OutlinedQuestionCircleIcon,
  BookmarkIcon,
  GripVerticalIcon,
  CheckIcon,
  TimesIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  FilterIcon,
} from '@patternfly/react-icons';
import type {
  AlertSeverity,
  AlertGroup,
  AlertComponent,
  SavedFilter,
  GroupByOption,
  SortByOption,
  ImportanceSizing,
} from '../data/types';

export interface SavedFiltersModalsProps {
  // Save Filter Modal
  isSaveFilterModalOpen: boolean;
  setIsSaveFilterModalOpen: (open: boolean) => void;
  newFilterName: string;
  setNewFilterName: (name: string) => void;
  saveGroupingSorting: boolean;
  setSaveGroupingSorting: (value: boolean) => void;
  saveSearchInput: boolean;
  setSaveSearchInput: (value: boolean) => void;
  mainPageTab: string | number;
  alertsTabSeverityFilter: AlertSeverity[];
  severityFilter: AlertSeverity[];
  alertsTabGroupFilter: AlertGroup[];
  groupFilter: AlertGroup[];
  alertsTabComponentFilter: AlertComponent[];
  componentFilter: AlertComponent[];
  alertsTabRegionFilter: string[];
  regionFilter: string[];
  alertsTabClusterFilter: string[];
  clusterFilter: string[];
  alertsTabNamespaceFilter: string[];
  namespaceFilter: string[];
  alertsTabLabelFilter: string[];
  labelFilter: string[];
  alertsTabSearchValue: string;
  searchValue: string;
  groupBy: GroupByOption;
  sortBy: SortByOption;
  importanceSizing: ImportanceSizing;
  sizeByOptions: { value: string; label: string }[];
  alertsGroupBy: string;
  savedFilters: SavedFilter[];
  setSavedFilters: React.Dispatch<React.SetStateAction<SavedFilter[]>>;
  setSelectedSavedFilter: (filter: SavedFilter | null) => void;
  addToast: (title: string, variant: 'success' | 'danger' | 'warning' | 'info', description?: string) => void;

  // Manage Saved Filters Modal
  isManageSavedFiltersModalOpen: boolean;
  setIsManageSavedFiltersModalOpen: (open: boolean) => void;
  editingFilterId: string | null;
  setEditingFilterId: (id: string | null) => void;
  editingFilterName: string;
  setEditingFilterName: (name: string) => void;
  selectedSavedFilter: SavedFilter | null;
  onEditFilterSelection?: (filter: SavedFilter) => void;
}

export const SavedFiltersModals: React.FunctionComponent<SavedFiltersModalsProps> = (props) => {
  const [setAsDefault, setSetAsDefault] = React.useState(false);

  const {
    isSaveFilterModalOpen,
    setIsSaveFilterModalOpen,
    newFilterName,
    setNewFilterName,
    saveGroupingSorting,
    setSaveGroupingSorting,
    saveSearchInput,
    setSaveSearchInput,
    mainPageTab,
    alertsTabSeverityFilter,
    severityFilter,
    alertsTabGroupFilter,
    groupFilter,
    alertsTabComponentFilter,
    componentFilter,
    alertsTabRegionFilter,
    regionFilter,
    alertsTabClusterFilter,
    clusterFilter,
    alertsTabNamespaceFilter,
    namespaceFilter,
    alertsTabLabelFilter,
    labelFilter,
    alertsTabSearchValue,
    searchValue,
    groupBy,
    sortBy,
    importanceSizing,
    sizeByOptions,
    alertsGroupBy,
    savedFilters,
    setSavedFilters,
    setSelectedSavedFilter,
    addToast,
    isManageSavedFiltersModalOpen,
    setIsManageSavedFiltersModalOpen,
    editingFilterId,
    setEditingFilterId,
    editingFilterName,
    setEditingFilterName,
    selectedSavedFilter,
    onEditFilterSelection,
  } = props;

  return (
    <>
      {/* Save Filter Modal */}
      <Modal
        variant="medium"
        isOpen={isSaveFilterModalOpen}
        onClose={() => {
          setIsSaveFilterModalOpen(false);
          setSaveGroupingSorting(true);
          setSaveSearchInput(true);
          setSetAsDefault(false);
        }}
      >
        <ModalHeader title="Save filter" />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <Content component="p">Filters will be saved for future use on your account.</Content>
            </StackItem>
            <StackItem>
              <FormGroup label="Filter name" isRequired>
                <TextInputGroup>
                  <TextInputGroupMain
                    placeholder="Enter filter name..."
                    value={newFilterName}
                    onChange={(_, value) => setNewFilterName(value)}
                  />
                </TextInputGroup>
              </FormGroup>
            </StackItem>
            <StackItem>
              <FormGroup
                label={
                  <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>Saved filter items</FlexItem>
                    <FlexItem>
                      <Tooltip content="Choose which filter settings to include when saving this filter">
                        <Button variant="plain" style={{ padding: 0, minWidth: 'auto' }}>
                          <OutlinedQuestionCircleIcon />
                        </Button>
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                }
                isRequired
              >
                <Stack hasGutter>
                  <StackItem>
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                      <FlexItem>
                        <Checkbox
                          id="save-selected-filters"
                          label="Selected filters"
                          isChecked={true}
                          isDisabled
                        />
                      </FlexItem>
                      {(() => {
                        const sf = mainPageTab === 'alerts' ? alertsTabSeverityFilter : severityFilter;
                        const gf = mainPageTab === 'alerts' ? alertsTabGroupFilter : groupFilter;
                        const cf = mainPageTab === 'alerts' ? alertsTabComponentFilter : componentFilter;
                        const rf = mainPageTab === 'alerts' ? alertsTabRegionFilter : regionFilter;
                        const clf = mainPageTab === 'alerts' ? alertsTabClusterFilter : clusterFilter;
                        const nf = mainPageTab === 'alerts' ? alertsTabNamespaceFilter : namespaceFilter;
                        const lf = mainPageTab === 'alerts' ? alertsTabLabelFilter : labelFilter;
                        return (
                          <>
                            {sf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Severity: ${sf.join(', ')}`}>
                                  <Label isCompact color="grey">{sf.length} severity</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                            {gf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Group: ${gf.join(', ')}`}>
                                  <Label isCompact color="grey">{gf.length} group</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                            {cf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Component: ${cf.join(', ')}`}>
                                  <Label isCompact color="grey">{cf.length} component</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                            {rf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Region: ${rf.join(', ')}`}>
                                  <Label isCompact color="grey">{rf.length} region</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                            {clf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Cluster: ${clf.join(', ')}`}>
                                  <Label isCompact color="grey">{clf.length} cluster</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                            {nf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Namespace: ${nf.join(', ')}`}>
                                  <Label isCompact color="grey">{nf.length} namespace</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                            {lf.length > 0 && (
                              <FlexItem>
                                <Tooltip content={`Label: ${lf.join(', ')}`}>
                                  <Label isCompact color="grey">{lf.length} label</Label>
                                </Tooltip>
                              </FlexItem>
                            )}
                          </>
                        );
                      })()}
                    </Flex>
                  </StackItem>
                  <StackItem>
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                      <FlexItem>
                        <Checkbox
                          id="save-search-input"
                          label="Input in search field"
                          isChecked={saveSearchInput && !!(mainPageTab === 'alerts' ? alertsTabSearchValue : searchValue)}
                          isDisabled={!(mainPageTab === 'alerts' ? alertsTabSearchValue : searchValue)}
                          onChange={(_, checked) => setSaveSearchInput(checked)}
                        />
                      </FlexItem>
                      {(mainPageTab === 'alerts' ? alertsTabSearchValue : searchValue) && (
                        <FlexItem>
                          <Tooltip content={`Search value: "${mainPageTab === 'alerts' ? alertsTabSearchValue : searchValue}"`}>
                            <Label isCompact color="grey">{mainPageTab === 'alerts' ? alertsTabSearchValue : searchValue}</Label>
                          </Tooltip>
                        </FlexItem>
                      )}
                    </Flex>
                  </StackItem>
                  <StackItem>
                    <Stack hasGutter>
                      <StackItem>
                        <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                          <FlexItem>
                            <Checkbox
                              id="save-grouping-sorting"
                              label="Include layout settings"
                              isChecked={saveGroupingSorting}
                              onChange={(_, checked) => setSaveGroupingSorting(checked)}
                            />
                          </FlexItem>
                          {mainPageTab === 'fleet-overview' ? (
                            <>
                              <FlexItem>
                                <Tooltip content={`Current group by setting: ${groupBy === 'none' ? 'None' : groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`}>
                                  <Label isCompact color="grey">Group by: {groupBy === 'none' ? 'None' : groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</Label>
                                </Tooltip>
                              </FlexItem>
                              <FlexItem>
                                <Tooltip content={`Current size by setting: ${
                                  importanceSizing === 'none' ? 'None (equal size)' :
                                  sizeByOptions.find(opt => opt.value === importanceSizing)?.label || 'Custom'
                                }`}>
                                  <Label isCompact color="grey">Size by: {
                                    importanceSizing === 'none' ? 'None (equal size)' :
                                    sizeByOptions.find(opt => opt.value === importanceSizing)?.label || 'Custom'
                                  }</Label>
                                </Tooltip>
                              </FlexItem>
                              <FlexItem>
                                <Tooltip content={`Current sort by setting: ${sortBy === 'severity' ? 'Severity' : sortBy === 'alertCount' ? 'Alert count' : 'Cluster name'}`}>
                                  <Label isCompact color="grey">Sort by: {sortBy === 'severity' ? 'Severity' : sortBy === 'alertCount' ? 'Alert count' : 'Cluster name'}</Label>
                                </Tooltip>
                              </FlexItem>
                            </>
                          ) : (
                            <>
                              <FlexItem>
                                <Tooltip content={`Current group by setting: ${alertsGroupBy === 'none' ? 'None' : alertsGroupBy === 'alertName' ? 'Alert name' : alertsGroupBy === 'impact' ? 'Alert scope' : alertsGroupBy.charAt(0).toUpperCase() + alertsGroupBy.slice(1)}`}>
                                  <Label isCompact color="grey">Group by: {alertsGroupBy === 'none' ? 'None' : alertsGroupBy === 'alertName' ? 'Alert name' : alertsGroupBy === 'impact' ? 'Alert scope' : alertsGroupBy.charAt(0).toUpperCase() + alertsGroupBy.slice(1)}</Label>
                                </Tooltip>
                              </FlexItem>
                              <FlexItem>
                                <Label isCompact color="grey">Aggregate by name: On</Label>
                              </FlexItem>
                            </>
                          )}
                        </Flex>
                      </StackItem>
                      <StackItem>
                        <Content component="small" className="pf-v6-u-color-200">
                          Note: Some saved items apply only to specific views.
                        </Content>
                      </StackItem>
                    </Stack>
                  </StackItem>
                </Stack>
              </FormGroup>
            </StackItem>
            <StackItem>
              <Checkbox
                id="set-as-default-filter"
                label={
                  <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>Set as default filter</FlexItem>
                    <FlexItem>
                      <Tooltip content="This filter will be automatically applied when you open this page. Only one filter can be set as default.">
                        <Button variant="plain" style={{ padding: 0, minWidth: 'auto' }}>
                          <OutlinedQuestionCircleIcon />
                        </Button>
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                }
                isChecked={setAsDefault}
                onChange={(_, checked) => setSetAsDefault(checked)}
              />
            </StackItem>
            <StackItem>
              <Content component="small" className="pf-v6-u-color-200">
                <InfoCircleIcon /> Your saved filters are specific to your account and won't be visible to other users.
              </Content>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              if (newFilterName.trim()) {
                const isAlerts = mainPageTab === 'alerts';
                const newFilter: SavedFilter = {
                  id: `sf-${Date.now()}`,
                  name: newFilterName.trim(),
                  filters: {
                    severity: isAlerts ? alertsTabSeverityFilter : severityFilter,
                    group: isAlerts ? alertsTabGroupFilter : groupFilter,
                    component: isAlerts ? alertsTabComponentFilter : componentFilter,
                    source: [],
                    searchValue: saveSearchInput ? (isAlerts ? alertsTabSearchValue : searchValue) : '',
                    region: isAlerts ? alertsTabRegionFilter : regionFilter,
                    cluster: isAlerts ? alertsTabClusterFilter : clusterFilter,
                    namespace: isAlerts ? alertsTabNamespaceFilter : namespaceFilter,
                    label: isAlerts ? alertsTabLabelFilter : labelFilter,
                  },
                  ...(saveGroupingSorting && {
                    viewSettings: {
                      groupBy,
                      sortBy,
                      importanceSizing,
                    }
                  }),
                  isDefault: setAsDefault,
                };
                if (setAsDefault) {
                  setSavedFilters([...savedFilters.map(f => ({ ...f, isDefault: false })), newFilter]);
                } else {
                  setSavedFilters([...savedFilters, newFilter]);
                }
                setSelectedSavedFilter(newFilter);
                setIsSaveFilterModalOpen(false);
                setNewFilterName('');
                setSaveGroupingSorting(true);
                setSaveSearchInput(true);
                setSetAsDefault(false);
                addToast('Filter saved successfully', 'success');
              }
            }}
            isDisabled={!newFilterName.trim()}
          >
            Save filter
          </Button>
          <Button variant="link" onClick={() => {
            setIsSaveFilterModalOpen(false);
            setNewFilterName('');
            setSaveGroupingSorting(true);
            setSaveSearchInput(true);
            setSetAsDefault(false);
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Manage Saved Filters Modal */}
      <Modal
        variant="medium"
        isOpen={isManageSavedFiltersModalOpen}
        onClose={() => {
          setIsManageSavedFiltersModalOpen(false);
          setEditingFilterId(null);
          setEditingFilterName('');
        }}
      >
        <ModalHeader title="Manage saved filters" />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <Content component="small" className="pf-v6-u-color-200">
                <InfoCircleIcon /> Your saved filters are specific to your account and won't be visible to other users.
              </Content>
            </StackItem>
            <StackItem>
              {savedFilters.length === 0 ? (
                <EmptyState titleText="No saved filters" icon={BookmarkIcon}>
                  <EmptyStateBody>You haven't saved any filters yet. Apply filters and click "Add to saved filters" to save them.</EmptyStateBody>
                </EmptyState>
              ) : (
                <DataList aria-label="Saved filters list" isCompact>
                  {savedFilters.map((filter) => (
                    <DataListItem key={filter.id} aria-labelledby={`filter-${filter.id}`}>
                      <DataListItemRow>
                        <DataListControl>
                          <Tooltip content="Drag to reorder">
                            <span style={{ cursor: 'grab', display: 'flex', alignItems: 'center', padding: '8px' }}>
                              <GripVerticalIcon />
                            </span>
                          </Tooltip>
                        </DataListControl>
                        <DataListItemCells
                          dataListCells={[
                            <DataListCell key="name" width={3}>
                              {editingFilterId === filter.id ? (
                                <TextInputGroup>
                                  <TextInputGroupMain
                                    value={editingFilterName}
                                    onChange={(_, value) => setEditingFilterName(value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && editingFilterName.trim()) {
                                        setSavedFilters(savedFilters.map(f =>
                                          f.id === filter.id ? { ...f, name: editingFilterName.trim() } : f
                                        ));
                                        setEditingFilterId(null);
                                        setEditingFilterName('');
                                      } else if (e.key === 'Escape') {
                                        setEditingFilterId(null);
                                        setEditingFilterName('');
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <TextInputGroupUtilities>
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        if (editingFilterName.trim()) {
                                          setSavedFilters(savedFilters.map(f =>
                                            f.id === filter.id ? { ...f, name: editingFilterName.trim() } : f
                                          ));
                                        }
                                        setEditingFilterId(null);
                                        setEditingFilterName('');
                                      }}
                                    >
                                      <CheckIcon />
                                    </Button>
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setEditingFilterId(null);
                                        setEditingFilterName('');
                                      }}
                                    >
                                      <TimesIcon />
                                    </Button>
                                  </TextInputGroupUtilities>
                                </TextInputGroup>
                              ) : (
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <FlexItem>
                                    <span id={`filter-${filter.id}`} style={{ opacity: filter.hidden ? 0.5 : 1 }}>
                                      <BookmarkIcon /> {filter.name}
                                    </span>
                                  </FlexItem>
                                  {filter.isDefault && (
                                    <FlexItem>
                                      <Label isCompact color="yellow" icon={<StarIcon />}>Default</Label>
                                    </FlexItem>
                                  )}
                                  {filter.hidden && (
                                    <FlexItem>
                                      <Label isCompact color="grey" icon={<EyeSlashIcon />}>Hidden</Label>
                                    </FlexItem>
                                  )}
                                </Flex>
                              )}
                            </DataListCell>,
                            <DataListCell key="filters" width={2}>
                              <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'wrap' }}>
                                {filter.filters.severity.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Severity: ${filter.filters.severity.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.severity.length} severity</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.group.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Group: ${filter.filters.group.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.group.length} group</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.component.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Component: ${filter.filters.component.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.component.length} component</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.source && filter.filters.source.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Source: ${filter.filters.source.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.source.length} source</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.searchValue && (
                                  <FlexItem>
                                    <Tooltip content={`Search: "${filter.filters.searchValue}"`}>
                                      <Label isCompact color="grey">search</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                              </Flex>
                            </DataListCell>,
                            <DataListCell key="actions" width={2} alignRight>
                              <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>
                                  <Tooltip content="Edit filter name">
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setEditingFilterId(filter.id);
                                        setEditingFilterName(filter.name);
                                      }}
                                      aria-label="Edit filter name"
                                    >
                                      <EditIcon />
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content={filter.hidden ? 'Show in menu' : 'Hide from menu'}>
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setSavedFilters(savedFilters.map(f =>
                                          f.id === filter.id ? { ...f, hidden: !f.hidden } : f
                                        ));
                                        addToast(
                                          filter.hidden ? `"${filter.name}" is now visible in the menu` : `"${filter.name}" is now hidden from the menu`,
                                          'info'
                                        );
                                      }}
                                      aria-label={filter.hidden ? 'Show in menu' : 'Hide from menu'}
                                    >
                                      {filter.hidden ? <EyeSlashIcon /> : <EyeIcon />}
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content={filter.isDefault ? 'Default filter (click to unset)' : 'Set as default filter'}>
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        if (filter.isDefault) {
                                          setSavedFilters(savedFilters.map(f =>
                                            f.id === filter.id ? { ...f, isDefault: false } : f
                                          ));
                                          addToast(`"${filter.name}" is no longer the default filter`, 'info');
                                        } else {
                                          setSavedFilters(savedFilters.map(f => ({
                                            ...f,
                                            isDefault: f.id === filter.id,
                                          })));
                                          addToast(`"${filter.name}" set as default filter`, 'success');
                                        }
                                      }}
                                      aria-label={filter.isDefault ? 'Unset default filter' : 'Set as default filter'}
                                      style={filter.isDefault ? { color: 'var(--pf-t--global--icon--color--status--warning--default)' } : undefined}
                                    >
                                      <StarIcon />
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content="Edit filter selection">
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        if (onEditFilterSelection) {
                                          onEditFilterSelection(filter);
                                          setIsManageSavedFiltersModalOpen(false);
                                          setEditingFilterId(null);
                                          setEditingFilterName('');
                                        }
                                      }}
                                      aria-label="Edit filter selection"
                                    >
                                      <FilterIcon />
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content="Delete filter">
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setSavedFilters(savedFilters.filter(f => f.id !== filter.id));
                                        if (selectedSavedFilter?.id === filter.id) {
                                          setSelectedSavedFilter(null);
                                        }
                                        addToast('Filter deleted', 'success');
                                      }}
                                      aria-label="Delete filter"
                                    >
                                      <TrashIcon />
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            </DataListCell>,
                          ]}
                        />
                      </DataListItemRow>
                    </DataListItem>
                  ))}
                </DataList>
              )}
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => {
            setIsManageSavedFiltersModalOpen(false);
            setEditingFilterId(null);
            setEditingFilterName('');
          }}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
