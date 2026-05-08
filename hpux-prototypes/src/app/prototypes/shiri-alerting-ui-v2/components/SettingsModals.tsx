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
  Card,
  CardBody,
  Content,
  Label,
  LabelGroup,
  TextInput,
  Alert as PfAlert,
} from '@patternfly/react-core';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  AngleRightIcon,
  AngleDownIcon,
  TrashIcon,
  PlusIcon,
} from '@patternfly/react-icons';
import { TypeaheadSelect } from '@patternfly/react-templates';
import type { AlertRule, EnvironmentCategory, TeamCategory } from '../data/types';

export interface SettingsModalsProps {
  // Disable Alert Rule Modal
  isDisableAlertRuleModalOpen: boolean;
  setIsDisableAlertRuleModalOpen: (open: boolean) => void;
  alertRulesToDisable: AlertRule[];
  setAlertRulesToDisable: (rules: AlertRule[]) => void;
  disableAlertRuleExpandedIds: string[];
  setDisableAlertRuleExpandedIds: (ids: string[]) => void;
  setSelectedAlertRuleIds: (ids: string[]) => void;
  addToast: (title: string, variant: 'success' | 'danger' | 'warning' | 'info', description?: string) => void;

  // Environment Grouping Settings Modal
  isEnvironmentSettingsOpen: boolean;
  setIsEnvironmentSettingsOpen: (open: boolean) => void;
  tempEnvironmentCategories: EnvironmentCategory[];
  setTempEnvironmentCategories: (categories: EnvironmentCategory[]) => void;
  newPatternInputs: Record<string, string>;
  setNewPatternInputs: (inputs: Record<string, string>) => void;
  availableLabelKeys: Array<{ value: string; content: string }>;
  setEnvironmentCategories: (categories: EnvironmentCategory[]) => void;

  // Team Grouping Settings Modal
  isTeamSettingsOpen: boolean;
  setIsTeamSettingsOpen: (open: boolean) => void;
  tempTeamCategories: TeamCategory[];
  setTempTeamCategories: (categories: TeamCategory[]) => void;
  newTeamPatternInputs: Record<string, string>;
  setNewTeamPatternInputs: (inputs: Record<string, string>) => void;
  setTeamCategories: (categories: TeamCategory[]) => void;
}

export const SettingsModals: React.FunctionComponent<SettingsModalsProps> = (props) => {
  const {
    isDisableAlertRuleModalOpen,
    setIsDisableAlertRuleModalOpen,
    alertRulesToDisable,
    setAlertRulesToDisable,
    disableAlertRuleExpandedIds,
    setDisableAlertRuleExpandedIds,
    setSelectedAlertRuleIds,
    addToast,
    isEnvironmentSettingsOpen,
    setIsEnvironmentSettingsOpen,
    tempEnvironmentCategories,
    setTempEnvironmentCategories,
    newPatternInputs,
    setNewPatternInputs,
    availableLabelKeys,
    setEnvironmentCategories,
    isTeamSettingsOpen,
    setIsTeamSettingsOpen,
    tempTeamCategories,
    setTempTeamCategories,
    newTeamPatternInputs,
    setNewTeamPatternInputs,
    setTeamCategories,
  } = props;

  return (
    <>
      {/* Disable Alert Rule Modal */}
      <Modal
        isOpen={isDisableAlertRuleModalOpen}
        onClose={() => setIsDisableAlertRuleModalOpen(false)}
        aria-labelledby="disable-alert-rule-modal-title-v2"
        aria-describedby="disable-alert-rule-modal-body-v2"
        variant="medium"
      >
        <ModalHeader
          title={
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
              <FlexItem>
                <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />
              </FlexItem>
              <FlexItem>
                {alertRulesToDisable.length === 1 ? 'Disable alert rule?' : 'Disable alert rules?'}
              </FlexItem>
            </Flex>
          }
          labelId="disable-alert-rule-modal-title-v2"
          description="Stop the rule from running altogether."
        />
        <ModalBody id="disable-alert-rule-modal-body-v2">
          <Stack hasGutter>
            {alertRulesToDisable.length === 1 ? (
              <>
                {/* Single alert rule disable */}
                <StackItem>
                  <Content component="p">
                    If you disable this alert rule, you'll no longer receive notifications when the conditions it monitors are met. This can lead to undetected issues that might impact your system's performance or availability.
                  </Content>
                </StackItem>
                <StackItem>
                  <Content component="p"><strong>Alert Details:</strong></Content>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><strong>Name</strong>: {alertRulesToDisable[0]?.name}</li>
                    <li><strong>Description</strong>: {alertRulesToDisable[0]?.description}</li>
                    <li><strong>Severity</strong>: {alertRulesToDisable[0]?.severity}</li>
                    <li><strong>Group</strong>: {alertRulesToDisable[0]?.group}</li>
                    <li><strong>Component:</strong> {alertRulesToDisable[0]?.component}</li>
                  </ul>
                </StackItem>
              </>
            ) : (
              <>
                {/* Bulk alert rules disable */}
                <StackItem>
                  <Content component="p"><strong>Are you sure you want to disable {alertRulesToDisable.length} selected alert rule{alertRulesToDisable.length > 1 ? 's' : ''}?</strong></Content>
                  <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Disabling an alert rule means you will no longer receive notifications when the conditions it monitors are met. This could lead to undetected issues that might impact your system's performance or availability.
                  </Content>
                </StackItem>
                <StackItem>
                  <Card>
                    <CardBody>
                      <Content component="p"><strong>The following Alerts will be disabled:</strong></Content>
                      <div style={{ marginTop: '16px' }}>
                        {alertRulesToDisable.map((rule) => (
                          <div key={rule.id} style={{ marginBottom: '8px' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>
                                <Button
                                  variant="plain"
                                  aria-label="Toggle details"
                                  onClick={() => {
                                    if (disableAlertRuleExpandedIds.includes(rule.id)) {
                                      setDisableAlertRuleExpandedIds(disableAlertRuleExpandedIds.filter(id => id !== rule.id));
                                    } else {
                                      setDisableAlertRuleExpandedIds([...disableAlertRuleExpandedIds, rule.id]);
                                    }
                                  }}
                                >
                                  {disableAlertRuleExpandedIds.includes(rule.id) ? <AngleDownIcon /> : <AngleRightIcon />}
                                </Button>
                              </FlexItem>
                              <FlexItem>
                                {rule.severity === 'Critical' && <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--default)" />}
                                {rule.severity === 'Warning' && <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />}
                                {rule.severity === 'Info' && <InfoCircleIcon color="var(--pf-t--global--color--status--info--default)" />}
                              </FlexItem>
                              <FlexItem>{rule.name}</FlexItem>
                            </Flex>
                            {disableAlertRuleExpandedIds.includes(rule.id) && (
                              <div style={{ marginLeft: '48px', marginTop: '8px', padding: '8px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px' }}>
                                <Content component="small">
                                  <div><strong>Description:</strong> {rule.description}</div>
                                  <div><strong>Severity:</strong> {rule.severity}</div>
                                  <div><strong>Group:</strong> {rule.group}</div>
                                  <div><strong>Component:</strong> {rule.component}</div>
                                </Content>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </StackItem>
              </>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              addToast(`${alertRulesToDisable.length === 1 ? 'Alert rule' : `${alertRulesToDisable.length} alert rules`} disabled successfully`, 'success');
              setIsDisableAlertRuleModalOpen(false);
              setAlertRulesToDisable([]);
              setSelectedAlertRuleIds([]);
            }}
          >
            Disable {alertRulesToDisable.length > 1 ? `${alertRulesToDisable.length} alerts` : 'alert'}
          </Button>
          <Button variant="secondary" onClick={() => {
            // Open silence modal instead
            setIsDisableAlertRuleModalOpen(false);
          }}>
            Silence instead
          </Button>
          <Button variant="link" onClick={() => {
            setIsDisableAlertRuleModalOpen(false);
            setAlertRulesToDisable([]);
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Environment Grouping Settings Modal */}
      <Modal
        isOpen={isEnvironmentSettingsOpen}
        onClose={() => setIsEnvironmentSettingsOpen(false)}
        variant="medium"
        aria-labelledby="environment-settings-modal-title"
      >
        <ModalHeader
          title="Environment grouping settings"
          labelId="environment-settings-modal-title"
        />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <PfAlert variant="info" isInline title="Group your clusters by mapping name patterns to specific environments">
                <Content component="p">
                  Group your clusters by mapping name patterns to specific environments. We process these rules in order—the first match determines the cluster's group.
                </Content>
              </PfAlert>
            </StackItem>

            {tempEnvironmentCategories.map((category, categoryIdx) => (
              <StackItem key={category.id}>
                <Card>
                  <CardBody>
                    <Stack hasGutter>
                      <StackItem>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <Content component="h4">
                              <strong>Category label</strong>
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              icon={<TrashIcon />}
                              aria-label="Delete category"
                              onClick={() => {
                                setTempEnvironmentCategories(tempEnvironmentCategories.filter((_, idx) => idx !== categoryIdx));
                              }}
                            />
                          </FlexItem>
                        </Flex>
                      </StackItem>
                      <StackItem>
                        <TextInput
                          value={category.label}
                          onChange={(_, value) => {
                            const updated = [...tempEnvironmentCategories];
                            updated[categoryIdx] = { ...updated[categoryIdx], label: value };
                            setTempEnvironmentCategories(updated);
                          }}
                          aria-label="Category label"
                        />
                      </StackItem>
                      <StackItem>
                        <Content component="h4">
                          <strong>Matching patterns</strong>
                        </Content>
                      </StackItem>
                      <StackItem>
                        <LabelGroup>
                          {category.patterns.map((pattern, patternIdx) => (
                            <Label
                              key={patternIdx}
                              color="grey"
                              onClose={() => {
                                const updated = [...tempEnvironmentCategories];
                                updated[categoryIdx] = {
                                  ...updated[categoryIdx],
                                  patterns: updated[categoryIdx].patterns.filter((_, idx) => idx !== patternIdx),
                                };
                                setTempEnvironmentCategories(updated);
                              }}
                            >
                              {pattern}
                            </Label>
                          ))}
                        </LabelGroup>
                      </StackItem>
                      <StackItem>
                        <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem flex={{ default: 'flex_1' }}>
                            <TypeaheadSelect
                              initialOptions={availableLabelKeys}
                              placeholder="Select or enter label key"
                              onSelect={(_, selection) => {
                                if (selection && typeof selection === 'string') {
                                  const updated = [...tempEnvironmentCategories];
                                  updated[categoryIdx] = {
                                    ...updated[categoryIdx],
                                    patterns: [...updated[categoryIdx].patterns, selection],
                                  };
                                  setTempEnvironmentCategories(updated);
                                  setNewPatternInputs({ ...newPatternInputs, [category.id]: '' });
                                }
                              }}
                              isCreatable
                              createOptionMessage={(newValue) => `Add label key: ${newValue}`}
                            />
                          </FlexItem>
                        </Flex>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </StackItem>
            ))}

            <StackItem>
              <Button
                variant="link"
                icon={<PlusIcon />}
                onClick={() => {
                  const newId = `category-${Date.now()}`;
                  setTempEnvironmentCategories([
                    ...tempEnvironmentCategories,
                    {
                      id: newId,
                      label: 'New Category',
                      color: 'purple',
                      patterns: [],
                    },
                  ]);
                }}
              >
                Add category
              </Button>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              setEnvironmentCategories(tempEnvironmentCategories);
              setIsEnvironmentSettingsOpen(false);
            }}
          >
            Save changes
          </Button>
          <Button
            variant="link"
            onClick={() => setIsEnvironmentSettingsOpen(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Team Grouping Settings Modal */}
      <Modal
        isOpen={isTeamSettingsOpen}
        onClose={() => setIsTeamSettingsOpen(false)}
        variant="medium"
        aria-labelledby="team-settings-modal-title"
      >
        <ModalHeader
          title="Team grouping settings"
          labelId="team-settings-modal-title"
        />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <PfAlert variant="info" isInline title="Group your clusters by mapping name patterns to specific teams">
                <Content component="p">
                  Group your clusters by mapping name patterns to specific teams. We process these rules in order—the first match determines the cluster's group.
                </Content>
              </PfAlert>
            </StackItem>

            {tempTeamCategories.map((category, categoryIdx) => (
              <StackItem key={category.id}>
                <Card>
                  <CardBody>
                    <Stack hasGutter>
                      <StackItem>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <Content component="h4">
                              <strong>Category label</strong>
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              icon={<TrashIcon />}
                              aria-label="Delete category"
                              onClick={() => {
                                setTempTeamCategories(tempTeamCategories.filter((_, idx) => idx !== categoryIdx));
                              }}
                            />
                          </FlexItem>
                        </Flex>
                      </StackItem>
                      <StackItem>
                        <TextInput
                          value={category.label}
                          onChange={(_, value) => {
                            const updated = [...tempTeamCategories];
                            updated[categoryIdx] = { ...updated[categoryIdx], label: value };
                            setTempTeamCategories(updated);
                          }}
                          aria-label="Category label"
                        />
                      </StackItem>
                      <StackItem>
                        <Content component="h4">
                          <strong>Matching patterns</strong>
                        </Content>
                      </StackItem>
                      <StackItem>
                        <LabelGroup>
                          {category.patterns.map((pattern, patternIdx) => (
                            <Label
                              key={patternIdx}
                              color="grey"
                              onClose={() => {
                                const updated = [...tempTeamCategories];
                                updated[categoryIdx] = {
                                  ...updated[categoryIdx],
                                  patterns: updated[categoryIdx].patterns.filter((_, idx) => idx !== patternIdx),
                                };
                                setTempTeamCategories(updated);
                              }}
                            >
                              {pattern}
                            </Label>
                          ))}
                        </LabelGroup>
                      </StackItem>
                      <StackItem>
                        <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem flex={{ default: 'flex_1' }}>
                            <TypeaheadSelect
                              initialOptions={availableLabelKeys}
                              placeholder="Select or enter label key"
                              onSelect={(_, selection) => {
                                if (selection && typeof selection === 'string') {
                                  const updated = [...tempTeamCategories];
                                  updated[categoryIdx] = {
                                    ...updated[categoryIdx],
                                    patterns: [...updated[categoryIdx].patterns, selection],
                                  };
                                  setTempTeamCategories(updated);
                                  setNewTeamPatternInputs({ ...newTeamPatternInputs, [category.id]: '' });
                                }
                              }}
                              isCreatable
                              createOptionMessage={(newValue) => `Add label key: ${newValue}`}
                            />
                          </FlexItem>
                        </Flex>
                      </StackItem>
                    </Stack>
                  </CardBody>
                </Card>
              </StackItem>
            ))}

            <StackItem>
              <Button
                variant="link"
                icon={<PlusIcon />}
                onClick={() => {
                  const newId = `category-${Date.now()}`;
                  setTempTeamCategories([
                    ...tempTeamCategories,
                    {
                      id: newId,
                      label: 'New Category',
                      color: 'purple',
                      patterns: [],
                    },
                  ]);
                }}
              >
                Add category
              </Button>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              setTeamCategories(tempTeamCategories);
              setIsTeamSettingsOpen(false);
            }}
          >
            Save changes
          </Button>
          <Button
            variant="link"
            onClick={() => setIsTeamSettingsOpen(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
