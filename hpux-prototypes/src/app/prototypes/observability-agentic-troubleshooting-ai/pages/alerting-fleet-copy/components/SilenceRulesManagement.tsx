/**
 * Silence rules — Management tab: table, bulk selection, details modal, edit form modal.
 * Create silence opens a full-page form (see CreateSilencePage route).
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Content,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  Flex,
  FlexItem,
  Button,
  Label,
  Stack,
  StackItem,
  Checkbox,
  Dropdown,
  DropdownList,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Title,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { EllipsisVIcon, FilterIcon, CaretDownIcon } from '@patternfly/react-icons';
import { SilenceRuleForm, type SilenceRuleEditSeed } from './SilenceRuleForm';
import './silenceRulesToolbar.css';

export interface SilenceRuleRow {
  id: string;
  name: string;
  matchers: string[];
  status: 'Active' | 'Expired';
  starts: string;
  ends: string;
  createdBy: string;
  comment?: string;
}

const MOCK_SILENCES: SilenceRuleRow[] = [
  {
    id: 'sr-1',
    name: 'Maintenance Window',
    matchers: ['cluster=prod-east-1'],
    status: 'Active',
    starts: 'Dec 18, 2025 00:00',
    ends: 'Dec 18, 2025 04:00',
    createdBy: 'admin@redhat.com',
    comment: 'Planned maintenance for prod-east-1.',
  },
  {
    id: 'sr-2',
    name: 'Known Issue - etcd',
    matchers: ['alertname=EtcdHighLatency'],
    status: 'Active',
    starts: 'Dec 15, 2025 12:00',
    ends: 'Dec 22, 2025 12:00',
    createdBy: 'sre@redhat.com',
    comment: 'Tracking etcd latency until patch lands.',
  },
  {
    id: 'sr-3',
    name: 'Upgrade Silence',
    matchers: ['severity=warning', 'region=EU West'],
    status: 'Expired',
    starts: 'Dec 10, 2025 08:00',
    ends: 'Dec 10, 2025 16:00',
    createdBy: 'ops@redhat.com',
  },
];

type SilenceStatusFilter = 'all' | 'Active' | 'Expired';

const silenceStatusFilterLabel = (v: SilenceStatusFilter) =>
  v === 'all' ? 'All silence states' : v;

export const SilenceRulesManagement: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [silenceStatusFilter, setSilenceStatusFilter] = React.useState<SilenceStatusFilter>('all');
  const [silenceSearch, setSilenceSearch] = React.useState('');
  const [isStatusSelectOpen, setIsStatusSelectOpen] = React.useState(false);
  const [isBulkPageMenuOpen, setIsBulkPageMenuOpen] = React.useState(false);
  const [kebabOpenId, setKebabOpenId] = React.useState<string | null>(null);

  const [detailsSilence, setDetailsSilence] = React.useState<SilenceRuleRow | null>(null);

  const [editFormOpen, setEditFormOpen] = React.useState(false);
  const [editSeed, setEditSeed] = React.useState<SilenceRuleEditSeed | null>(null);

  const openEdit = (row: SilenceRuleRow) => {
    setEditSeed({
      id: row.id,
      name: row.name,
      matchers: row.matchers,
      comment: row.comment,
    });
    setEditFormOpen(true);
    setKebabOpenId(null);
  };

  const filteredSilences = React.useMemo(() => {
    const q = silenceSearch.trim().toLowerCase();
    return MOCK_SILENCES.filter((row) => {
      if (silenceStatusFilter !== 'all' && row.status !== silenceStatusFilter) {
        return false;
      }
      if (q && !row.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [silenceSearch, silenceStatusFilter]);

  const filteredIds = React.useMemo(() => filteredSilences.map((s) => s.id), [filteredSilences]);

  const allSelected =
    filteredSilences.length > 0 && filteredSilences.every((s) => selectedIds.includes(s.id));
  const someSelected =
    filteredSilences.some((s) => selectedIds.includes(s.id)) && !allSelected;

  const mergeSelectFiltered = () => {
    const set = new Set(selectedIds);
    filteredIds.forEach((id) => set.add(id));
    setSelectedIds(Array.from(set));
  };

  const clearSelectFiltered = () => {
    setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Silence rules</CardTitle>
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <div className="silence-rules-toolbar">
            <div className="silence-rules-toolbar__left">
              <div className="silence-rules-toolbar__bulk">
                <div className="silence-rules-toolbar__bulk-check">
                  <Checkbox
                    id="silence-select-all"
                    aria-label="Select all silence rules on this page"
                    isChecked={allSelected ? true : someSelected ? null : false}
                    onChange={(_, checked) => {
                      if (checked) {
                        mergeSelectFiltered();
                      } else {
                        clearSelectFiltered();
                      }
                    }}
                  />
                </div>
                <div className="silence-rules-toolbar__bulk-sep" aria-hidden />
                <Dropdown
                  isOpen={isBulkPageMenuOpen}
                  onOpenChange={setIsBulkPageMenuOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={() => setIsBulkPageMenuOpen(!isBulkPageMenuOpen)}
                      isExpanded={isBulkPageMenuOpen}
                      aria-label="Bulk selection options"
                      icon={<CaretDownIcon />}
                    />
                  )}
                >
                  <DropdownList>
                    <DropdownItem
                      key="select-page"
                      onClick={() => {
                        mergeSelectFiltered();
                        setIsBulkPageMenuOpen(false);
                      }}
                    >
                      Select all in page
                    </DropdownItem>
                    <DropdownItem
                      key="deselect-page"
                      onClick={() => {
                        clearSelectFiltered();
                        setIsBulkPageMenuOpen(false);
                      }}
                    >
                      Deselect all in page
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </div>
              <Select
                isOpen={isStatusSelectOpen}
                onOpenChange={setIsStatusSelectOpen}
                selected={silenceStatusFilter}
                onSelect={(_, value) => {
                  setSilenceStatusFilter(value as SilenceStatusFilter);
                  setIsStatusSelectOpen(false);
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="secondary"
                    icon={<FilterIcon />}
                    onClick={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
                    isExpanded={isStatusSelectOpen}
                    style={{ minWidth: 220 }}
                  >
                    {silenceStatusFilterLabel(silenceStatusFilter)}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="all">All silence states</SelectOption>
                  <SelectOption value="Active">Active</SelectOption>
                  <SelectOption value="Expired">Expired</SelectOption>
                </SelectList>
              </Select>
              <SearchInput
                className="silence-rules-toolbar__search"
                placeholder="Search by rule name"
                value={silenceSearch}
                onChange={(_, value) => setSilenceSearch(value)}
                onClear={() => setSilenceSearch('')}
              />
            </div>
            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
              <FlexItem>
                <Button variant="secondary" isDisabled={selectedIds.length === 0}>
                  Expire silence
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="primary" onClick={() => navigate('/core/observe/alerting-v2/create-silence')}>
                  Create silence rule
                </Button>
              </FlexItem>
            </Flex>
          </div>
          <Table aria-label="Silence rules table" variant="compact">
            <Thead>
              <Tr>
                <Th screenReaderText="Select row" />
                <Th>Silence name</Th>
                <Th>Matchers</Th>
                <Th>Status</Th>
                <Th>Starts</Th>
                <Th>Ends</Th>
                <Th>Created by</Th>
                <Th screenReaderText="Row actions" />
              </Tr>
            </Thead>
            <Tbody>
              {filteredSilences.map((row) => (
                <Tr key={row.id}>
                  <Td>
                    <Checkbox
                      id={`silence-row-${row.id}`}
                      isChecked={selectedIds.includes(row.id)}
                      onChange={(_, checked) => {
                        if (checked) setSelectedIds([...selectedIds, row.id]);
                        else setSelectedIds(selectedIds.filter((id) => id !== row.id));
                      }}
                      aria-label={`Select ${row.name}`}
                    />
                  </Td>
                  <Td>
                    <Button variant="link" isInline onClick={() => setDetailsSilence(row)}>
                      {row.name}
                    </Button>
                  </Td>
                  <Td>
                    <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'wrap' }}>
                      {row.matchers.map((m) => (
                        <Label key={m} isCompact variant="outline">
                          {m}
                        </Label>
                      ))}
                    </Flex>
                  </Td>
                  <Td>
                    <Label color={row.status === 'Active' ? 'green' : 'grey'} isCompact>
                      {row.status}
                    </Label>
                  </Td>
                  <Td>{row.starts}</Td>
                  <Td>{row.ends}</Td>
                  <Td>{row.createdBy}</Td>
                  <Td>
                    <Dropdown
                      isOpen={kebabOpenId === row.id}
                      onOpenChange={(open) => setKebabOpenId(open ? row.id : null)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="plain"
                          onClick={() => setKebabOpenId(kebabOpenId === row.id ? null : row.id)}
                          isExpanded={kebabOpenId === row.id}
                          aria-label={`Actions for ${row.name}`}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem
                          key="edit"
                          onClick={() => {
                            openEdit(row);
                          }}
                        >
                          Edit silence
                        </DropdownItem>
                        <DropdownItem key="dup" onClick={() => setKebabOpenId(null)}>
                          Duplicate
                        </DropdownItem>
                        <DropdownItem key="exp" onClick={() => setKebabOpenId(null)}>
                          Expire
                        </DropdownItem>
                        <DropdownItem key="del" onClick={() => setKebabOpenId(null)}>
                          Delete
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={detailsSilence !== null}
        onClose={() => setDetailsSilence(null)}
        variant="medium"
        aria-labelledby="silence-details-title"
      >
        <ModalHeader title={detailsSilence ? `Silence: ${detailsSilence.name}` : 'Silence details'} labelId="silence-details-title" />
        <ModalBody>
          {detailsSilence && (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  Matchers
                </Title>
                <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'wrap' }} style={{ marginTop: 8 }}>
                  {detailsSilence.matchers.map((m) => (
                    <Label key={m} isCompact variant="outline">
                      {m}
                    </Label>
                  ))}
                </Flex>
              </StackItem>
              <StackItem>
                <Content component="p">
                  <strong>Status:</strong> {detailsSilence.status}
                </Content>
                <Content component="p">
                  <strong>Starts:</strong> {detailsSilence.starts}
                </Content>
                <Content component="p">
                  <strong>Ends:</strong> {detailsSilence.ends}
                </Content>
                <Content component="p">
                  <strong>Created by:</strong> {detailsSilence.createdBy}
                </Content>
                {detailsSilence.comment && (
                  <Content component="p">
                    <strong>Comment:</strong> {detailsSilence.comment}
                  </Content>
                )}
              </StackItem>
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setDetailsSilence(null)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={editFormOpen}
        onClose={() => {
          setEditFormOpen(false);
          setEditSeed(null);
        }}
        variant="large"
        aria-labelledby="silence-edit-title"
      >
        <ModalHeader
          title={editSeed ? `Edit silence: ${editSeed.name}` : 'Edit silence'}
          labelId="silence-edit-title"
        />
        <ModalBody style={{ maxHeight: '70vh', overflow: 'auto' }}>
          {editSeed && (
            <SilenceRuleForm
              key={editSeed.id}
              mode="edit"
              editSeed={editSeed}
              onCancel={() => {
                setEditFormOpen(false);
                setEditSeed(null);
              }}
              onSubmit={() => {
                setEditFormOpen(false);
                setEditSeed(null);
              }}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
