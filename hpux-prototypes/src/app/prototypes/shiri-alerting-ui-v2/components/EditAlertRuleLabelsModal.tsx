/**
 * Bulk action: edit labels on selected alert rules (prototype).
 * Labels are key=value pairs. Uses PatternFly Multi-typeahead select (@patternfly/react-templates).
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
  Card,
  CardBody,
  Content,
  Popover,
} from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  QuestionCircleIcon,
  AngleRightIcon,
} from '@patternfly/react-icons';
import { MultiTypeaheadSelect, type MultiTypeaheadSelectOption } from '@patternfly/react-templates';
import type { AlertRule } from '../data/types';

export interface EditAlertRuleLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: AlertRule[];
  /** Full fleet catalog for existing label suggestions */
  allAlertRules: AlertRule[];
  onApply: (labels: string[]) => void;
}

/** Non-empty key and value around the first `=` */
function isValidKeyValuePair(s: string): boolean {
  const t = s.trim();
  const i = t.indexOf('=');
  if (i <= 0 || i >= t.length - 1) {
    return false;
  }
  const key = t.slice(0, i).trim();
  const val = t.slice(i + 1).trim();
  return key.length > 0 && val.length > 0;
}

function severityIcon(rule: AlertRule) {
  if (rule.severity === 'Critical') {
    return <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--default)" />;
  }
  if (rule.severity === 'Warning') {
    return <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />;
  }
  return <InfoCircleIcon color="var(--pf-t--global--color--status--info--default)" />;
}

export const EditAlertRuleLabelsModal: React.FunctionComponent<EditAlertRuleLabelsModalProps> = ({
  isOpen,
  onClose,
  rules,
  allAlertRules,
  onApply,
}) => {
  const [selections, setSelections] = React.useState<(string | number)[]>([]);
  const [filterInput, setFilterInput] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const union = new Set<string>();
    rules.forEach((r) => r.labels.forEach((l) => union.add(l)));
    setSelections(Array.from(union));
    setFilterInput('');
  }, [isOpen, rules]);

  const initialOptions = React.useMemo(() => {
    const fleetLabelSet = new Set<string>();
    allAlertRules.forEach((r) => r.labels.forEach((l) => fleetLabelSet.add(l)));

    const catalogVals = new Set<string>();
    allAlertRules.forEach((r) => r.labels.forEach((l) => catalogVals.add(l)));
    selections.forEach((s) => catalogVals.add(String(s)));

    const sorted = Array.from(catalogVals).sort();
    const rows: MultiTypeaheadSelectOption[] = sorted.map((s) => ({
      value: s,
      content: s,
      selected: selections.map(String).includes(s),
    }));

    const trimmed = filterInput.trim();
    const selectedStr = selections.map(String);
    const canOfferNew =
      isValidKeyValuePair(trimmed) &&
      !fleetLabelSet.has(trimmed) &&
      !selectedStr.includes(trimmed);

    if (canOfferNew) {
      rows.push({
        value: trimmed,
        content: `Add "${trimmed}" as new label`,
        selected: false,
      });
    }

    return rows;
  }, [allAlertRules, selections, filterInput]);

  const count = rules.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="edit-alert-rule-labels-title"
      aria-describedby="edit-alert-rule-labels-body"
      variant="medium"
      ouiaId="edit-alert-rule-labels-modal"
    >
      <ModalHeader
        title={
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
            <FlexItem>Edit alert rule labels</FlexItem>
            <FlexItem>
              <Popover
                aria-label="About editing labels"
                headerContent={<div>Labels</div>}
                bodyContent={
                  <Content component="p">
                    Labels must use <code>key=value</code> pairs (for example <code>env=production</code>). Type to
                    match existing pairs from your fleet, or type a new <code>key=value</code> and choose{' '}
                    <strong>Add &quot;…&quot; as new label</strong> from the list.
                  </Content>
                }
              >
                <Button variant="plain" aria-label="Help" icon={<QuestionCircleIcon />} />
              </Popover>
            </FlexItem>
          </Flex>
        }
        labelId="edit-alert-rule-labels-title"
        description={
          count === 1
            ? 'You are about to modify labels for 1 selected alert rule. These changes will apply to the selected alert.'
            : `You are about to modify labels for ${count} selected alert rules. These changes will apply to all selected alerts.`
        }
      />
      <ModalBody id="edit-alert-rule-labels-body">
        <Stack hasGutter>
          <StackItem>
            <Content component="h4">
              <strong>Add, update, or remove labels</strong>
            </Content>
            <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              Each label is a <code>key=value</code> pair. You can add new pairs, update values by removing a chip and
              selecting another, or remove labels from all selected alert rules.
            </Content>
          </StackItem>
          <StackItem>
            <MultiTypeaheadSelect
              key={rules.map((r) => r.id).sort().join(',')}
              initialOptions={initialOptions}
              placeholder="Type key=value or select existing label"
              toggleWidth="100%"
              noOptionsFoundMessage={(filter) => `No matching labels for "${filter}"`}
              onSelectionChange={(_event, next) => {
                setSelections(next.map((v) => String(v)));
              }}
              onInputChange={(v) => setFilterInput(v)}
              aria-label="Alert rule labels, key=value pairs"
            />
          </StackItem>
          <StackItem>
            <Card>
              <CardBody>
                <Content component="p">
                  <strong>The following alert rules will have their labels updated:</strong>
                </Content>
                <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  {rules.map((rule) => (
                    <div key={rule.id} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem style={{ color: 'var(--pf-t--global--icon--color--subtle)' }}>
                          <AngleRightIcon />
                        </FlexItem>
                        <FlexItem>{severityIcon(rule)}</FlexItem>
                        <FlexItem>
                          <strong>{rule.name}</strong>
                        </FlexItem>
                      </Flex>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          onClick={() => {
            const valid = selections.map(String).filter(isValidKeyValuePair);
            onApply(valid);
            onClose();
          }}
        >
          Apply labels
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
