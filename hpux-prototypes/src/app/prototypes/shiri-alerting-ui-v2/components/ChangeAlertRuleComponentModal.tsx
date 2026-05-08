/**
 * Bulk action: change alert scope and component for selected alert rules (prototype).
 * "Affected component" matches Create Alert Rule wizard: typeahead Select with creatable option.
 */

import * as React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Content,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  MenuToggleElement,
  Popover,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Tooltip,
} from '@patternfly/react-core';
import { InfoCircleIcon, QuestionCircleIcon, TimesIcon } from '@patternfly/react-icons';
import type { AlertGroup, AlertRule } from '../data/types';

/** Same built-in list as CreateAlertRulePage typeahead */
const BUILTIN_COMPONENTS: string[] = [
  'kube-apiserver',
  'Storage',
  'Network',
  'etcd',
  'Scheduler',
  'Controller',
  'Workload',
  'Pod',
  'Quota',
];

export interface ChangeAlertRuleComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Selected rules (for count and defaulting alert scope) */
  rules: AlertRule[];
  onConfirm: (payload: { group: AlertGroup; component: string }) => void;
}

export const ChangeAlertRuleComponentModal: React.FunctionComponent<ChangeAlertRuleComponentModalProps> = ({
  isOpen,
  onClose,
  rules,
  onConfirm,
}) => {
  const [alertScope, setAlertScope] = React.useState<AlertGroup>('Cluster');
  const [componentValue, setComponentValue] = React.useState('');
  const [componentInputValue, setComponentInputValue] = React.useState('');
  const [customComponents, setCustomComponents] = React.useState<string[]>([]);
  const [isScopeOpen, setIsScopeOpen] = React.useState(false);
  const [isComponentOpen, setIsComponentOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen || rules.length === 0) {
      return;
    }
    const groups = new Set(rules.map((r) => r.group));
    setAlertScope(groups.size === 1 ? (Array.from(groups)[0] as AlertGroup) : 'Cluster');
    setComponentValue('');
    setComponentInputValue('');
    setCustomComponents([]);
    setIsScopeOpen(false);
    setIsComponentOpen(false);
  }, [isOpen, rules]);

  const allComponents = React.useMemo(() => [...BUILTIN_COMPONENTS, ...customComponents], [customComponents]);

  const filteredComponents = React.useMemo(() => {
    if (!componentInputValue) {
      return allComponents;
    }
    return allComponents.filter((c) => c.toLowerCase().includes(componentInputValue.toLowerCase()));
  }, [componentInputValue, allComponents]);

  const handleComponentSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    if (value === 'create-new') {
      const typed = componentInputValue.trim();
      if (typed && !allComponents.includes(typed)) {
        setCustomComponents((prev) => [...prev, typed]);
        setComponentValue(typed);
      }
    } else if (value !== undefined) {
      setComponentValue(value as string);
    }
    setIsComponentOpen(false);
    setComponentInputValue('');
  };

  const count = rules.length;
  const hasComponent = componentValue.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="change-alert-rule-component-title"
      aria-describedby="change-alert-rule-component-body"
      variant="medium"
      ouiaId="change-alert-rule-component-modal"
    >
      <ModalHeader
        title={
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
            <FlexItem>Change alert rule component</FlexItem>
            <FlexItem>
              <Popover
                aria-label="About changing component"
                headerContent={<div>Component</div>}
                bodyContent={
                  <Content component="p">
                    Pick an existing component from the list or type a new name and choose{' '}
                    <strong>Create &quot;…&quot;</strong>, matching the Create alert rule wizard.
                  </Content>
                }
              >
                <Button variant="plain" aria-label="Help" icon={<QuestionCircleIcon />} />
              </Popover>
            </FlexItem>
          </Flex>
        }
        labelId="change-alert-rule-component-title"
        description="The selected component will replace each of the selected alert rules component."
      />
      <ModalBody id="change-alert-rule-component-body">
        <Form maxWidth="700px">
          <Stack hasGutter>
            <StackItem>
              <Flex
                direction={{ default: 'column', md: 'row' }}
                gap={{ default: 'gapLg' }}
                alignItems={{ default: 'alignItemsFlexStart' }}
              >
                <FlexItem flex={{ default: 'flex_1' }} style={{ width: '100%' }}>
                  <FormGroup
                    label={
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>Alert scope</FlexItem>
                        <FlexItem>
                          <Tooltip content="Indicates whether the alert affects the entire cluster or a specific namespace.">
                            <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                          </Tooltip>
                        </FlexItem>
                      </Flex>
                    }
                    fieldId="bulk-change-alert-scope"
                  >
                    <Select
                      id="bulk-change-alert-scope"
                      isOpen={isScopeOpen}
                      selected={alertScope}
                      onOpenChange={setIsScopeOpen}
                      onSelect={(_, value) => {
                        setAlertScope(value as AlertGroup);
                        setIsScopeOpen(false);
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsScopeOpen(!isScopeOpen)}
                          isExpanded={isScopeOpen}
                          isFullWidth
                        >
                          {alertScope}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Cluster">Cluster</SelectOption>
                        <SelectOption value="Namespace">Namespace</SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>
                </FlexItem>
                <FlexItem flex={{ default: 'flex_1' }} style={{ width: '100%' }}>
                  <FormGroup
                    label={
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>Affected component</FlexItem>
                        <FlexItem>
                          <Tooltip content="The specific services, operators, or nodes affected by this alert.">
                            <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                          </Tooltip>
                        </FlexItem>
                      </Flex>
                    }
                    fieldId="bulk-change-component"
                  >
                    <Select
                      isOpen={isComponentOpen}
                      onOpenChange={setIsComponentOpen}
                      onSelect={handleComponentSelect}
                      selected={componentValue || undefined}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsComponentOpen(!isComponentOpen)}
                          isExpanded={isComponentOpen}
                          style={{ width: '100%' }}
                          variant="typeahead"
                        >
                          <TextInputGroup isPlain>
                            <TextInputGroupMain
                              value={componentInputValue || componentValue}
                              onChange={(_, value) => {
                                setComponentInputValue(value);
                                if (!isComponentOpen) {
                                  setIsComponentOpen(true);
                                }
                              }}
                              onClick={() => setIsComponentOpen(true)}
                              placeholder="Select or create a component"
                              autoComplete="off"
                            />
                            {(componentInputValue || componentValue) ? (
                              <TextInputGroupUtilities>
                                <Button
                                  variant="plain"
                                  onClick={() => {
                                    setComponentInputValue('');
                                    setComponentValue('');
                                  }}
                                  aria-label="Clear input"
                                >
                                  <TimesIcon />
                                </Button>
                              </TextInputGroupUtilities>
                            ) : null}
                          </TextInputGroup>
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        {filteredComponents.map((c) => (
                          <SelectOption key={c} value={c}>
                            {c}
                          </SelectOption>
                        ))}
                        {componentInputValue.trim() && !allComponents.includes(componentInputValue.trim()) ? (
                          <SelectOption value="create-new" description="Create new component">
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <span>Create &quot;{componentInputValue.trim()}&quot;</span>
                            </Flex>
                          </SelectOption>
                        ) : null}
                      </SelectList>
                    </Select>
                  </FormGroup>
                </FlexItem>
              </Flex>
              <FormHelperText style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                <HelperText>
                  <HelperTextItem>
                    The high-level impact, alert scope, and component the alert relates to.
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </StackItem>
            <StackItem>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--pf-t--global--spacer--sm)',
                  alignItems: 'flex-start',
                  padding: 'var(--pf-t--global--spacer--md)',
                  borderRadius: 'var(--pf-t--global--border--radius--default)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--pf-t--global--border--color--non-status--purple, #8764df)',
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                }}
              >
                <InfoCircleIcon
                  style={{
                    flexShrink: 0,
                    marginTop: '2px',
                    color: 'var(--pf-t--global--color--nonstatus--purple--default, #8764df)',
                  }}
                />
                <Content component="p" style={{ margin: 0 }}>
                  The new selected component will replace {count} selected alert rule{count === 1 ? '' : 's'}{' '}
                  component{count === 1 ? '' : 's'}.
                </Content>
              </div>
            </StackItem>
          </Stack>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          isDisabled={!hasComponent}
          onClick={() => {
            if (!hasComponent) {
              return;
            }
            onConfirm({
              group: alertScope,
              component: componentValue.trim(),
            });
            onClose();
          }}
        >
          Change component
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
