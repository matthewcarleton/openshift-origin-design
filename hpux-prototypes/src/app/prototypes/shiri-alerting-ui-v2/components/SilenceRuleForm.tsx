/**
 * Shared create/edit silence form (used by full page and edit modal).
 */

import * as React from 'react';
import {
  Content,
  Flex,
  FlexItem,
  Button,
  Stack,
  StackItem,
  Checkbox,
  Radio,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Tooltip,
  Title,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { MinusCircleIcon, QuestionCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import './silenceRuleForm.css';

export interface SilenceRuleEditSeed {
  id: string;
  name: string;
  matchers: string[];
  comment?: string;
}

const FLEET_CLUSTER_COUNT = 110;

interface FleetClusterRow {
  name: string;
  labels: Record<string, string>;
}

function buildFleetRows(): FleetClusterRow[] {
  const rows: FleetClusterRow[] = [];
  for (let i = 0; i < FLEET_CLUSTER_COUNT; i++) {
    rows.push({
      name: `fleet-ocp-${String(i + 1).padStart(3, '0')}`,
      labels: { env: i % 4 === 0 ? 'prod' : 'dev', team: `team-${(i % 9) + 1}` },
    });
  }
  return rows;
}

const fleetClusters = buildFleetRows();

interface LabelMatcherRow {
  id: string;
  labelValue: string;
  labelName: string;
  isRegex: boolean;
  isNegative: boolean;
}

const RequiredMark: React.FC = () => (
  <span className="silence-rule-form__required-star" style={{ color: '#c9190b' }} aria-hidden="true">
    *
  </span>
);

export interface SilenceRuleFormProps {
  mode: 'create' | 'edit';
  editSeed?: SilenceRuleEditSeed | null;
  /** When false, the intro paragraph is omitted (e.g. shown on the full-page header instead). */
  showIntroText?: boolean;
  /** When false, the fleet target section is hidden (full-page create flow matches compact mockup). */
  showTargetClusters?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const SilenceRuleForm: React.FunctionComponent<SilenceRuleFormProps> = ({
  mode,
  editSeed,
  showIntroText = true,
  showTargetClusters = true,
  onCancel,
  onSubmit,
}) => {
  const [silenceFromDate, setSilenceFromDate] = React.useState('');
  const [silenceFromTime, setSilenceFromTime] = React.useState('00:00');
  const [durationKind, setDurationKind] = React.useState<'for' | 'until'>('for');
  const [forAmount, setForAmount] = React.useState(2);
  const [forUnit, setForUnit] = React.useState<'Hours' | 'Days' | 'Weeks'>('Hours');
  const [isForUnitOpen, setIsForUnitOpen] = React.useState(false);
  const [untilDate, setUntilDate] = React.useState('');
  const [untilTime, setUntilTime] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [matchers, setMatchers] = React.useState<LabelMatcherRow[]>([
    { id: 'm1', labelValue: '', labelName: '', isRegex: false, isNegative: false },
  ]);

  const [targetAllClusters, setTargetAllClusters] = React.useState(true);
  const [selectedClusters, setSelectedClusters] = React.useState<string[]>([]);
  const [clusterSearch, setClusterSearch] = React.useState('');

  const resetCreateDefaults = React.useCallback(() => {
    const d = new Date();
    setSilenceFromDate(d.toISOString().split('T')[0]);
    setSilenceFromTime('00:00');
    setDurationKind('for');
    setForAmount(2);
    setForUnit('Hours');
    setUntilDate('');
    setUntilTime('');
    setComment('');
    setMatchers([{ id: `m-${Date.now()}`, labelValue: '', labelName: '', isRegex: false, isNegative: false }]);
    setTargetAllClusters(true);
    setSelectedClusters([]);
    setClusterSearch('');
  }, []);

  React.useEffect(() => {
    if (mode === 'create') {
      resetCreateDefaults();
      return;
    }
    if (mode === 'edit' && editSeed) {
      setComment(editSeed.comment ?? '');
      setSilenceFromDate('2025-09-21');
      setSilenceFromTime('00:00');
      setDurationKind('for');
      setForAmount(2);
      setForUnit('Hours');
      const first = editSeed.matchers[0] ?? '';
      const eq = first.indexOf('=');
      const namePart = eq >= 0 ? first.slice(0, eq) : '';
      const valPart = eq >= 0 ? first.slice(eq + 1) : '';
      setMatchers([
        {
          id: 'm-edit-1',
          labelValue: valPart,
          labelName: namePart,
          isRegex: false,
          isNegative: false,
        },
      ]);
      setTargetAllClusters(true);
      setSelectedClusters([]);
      setClusterSearch('');
    }
  }, [mode, editSeed, resetCreateDefaults]);

  const filteredFleet = React.useMemo(() => {
    const q = clusterSearch.trim().toLowerCase();
    if (!q) return fleetClusters;
    return fleetClusters.filter((c) => c.name.toLowerCase().includes(q));
  }, [clusterSearch]);

  return (
    <div className="silence-rule-form">
      <Stack hasGutter>
        {showIntroText && (
          <StackItem>
            <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              Silences temporarily mute alerts based on a set of label selectors that you define. Notifications will not be sent for alerts that match all the listed values or regular expressions.
            </Content>
          </StackItem>
        )}

        <StackItem className="silence-rule-form__section--details">
          <Title className="silence-rule-form__section-heading" headingLevel="h3" size="md">
            Silence details
          </Title>
          <Content component="p" style={{ marginTop: 8 }}>
            Add details about this silence so that others in the team can see. When the alert state is set to &apos;Silenced&apos;, all alert notifications will be muted until the specified time. The creator of this silence is admin@nyy.com.
          </Content>
        </StackItem>

        <StackItem className="silence-rule-form__section--duration">
          <Title className="silence-rule-form__section-heading" headingLevel="h3" size="md">
            Silence duration
          </Title>
          <Form style={{ marginTop: 12 }}>
            <FormGroup
              label={
                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                  <FlexItem>
                    Silence notifications for all applicable alerts<RequiredMark />
                  </FlexItem>
                  <FlexItem>
                    <Tooltip content="When notifications resume after this silence ends.">
                      <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                    </Tooltip>
                  </FlexItem>
                </Flex>
              }
              fieldId="silence-duration-main"
            >
              <div className="silence-rule-form__from-row">
                <Content component="small" className="silence-rule-form__from-label" style={{ fontWeight: 600 }}>
                  From
                </Content>
                <div className="silence-rule-form__from-inputs">
                  <TextInput
                    id="silence-from-date"
                    className="silence-rule-form__input-date"
                    type="date"
                    value={silenceFromDate}
                    onChange={(_, v) => setSilenceFromDate(v)}
                    aria-label="Silence start date"
                  />
                  <TextInput
                    id="silence-from-time"
                    className="silence-rule-form__input-time"
                    type="time"
                    value={silenceFromTime}
                    onChange={(_, v) => setSilenceFromTime(v)}
                    aria-label="Silence start time"
                  />
                </div>
              </div>

              <Stack hasGutter>
                <StackItem>
                  <Radio
                    id="silence-for"
                    className="silence-rule-form__duration-radio-row"
                    name="silence-duration-kind"
                    label="For"
                    isChecked={durationKind === 'for'}
                    onChange={() => setDurationKind('for')}
                    body={
                      <div className="silence-rule-form__for-duration">
                        <div className="silence-rule-form__for-controls-row">
                          <Button variant="control" onClick={() => setForAmount(Math.max(1, forAmount - 1))}>
                            −
                          </Button>
                          <TextInput
                            id="silence-for-amount"
                            className="silence-rule-form__input-amount"
                            type="number"
                            value={forAmount}
                            onChange={(_, v) => setForAmount(Number(v) || 1)}
                            aria-label="Duration amount"
                          />
                          <Button variant="control" onClick={() => setForAmount(forAmount + 1)}>
                            +
                          </Button>
                          <div className="silence-rule-form__select-unit-wrap">
                            <Select
                              isOpen={isForUnitOpen}
                              onOpenChange={setIsForUnitOpen}
                              selected={forUnit}
                              onSelect={(_, value) => {
                                setForUnit(value as typeof forUnit);
                                setIsForUnitOpen(false);
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  className="silence-rule-form__select-unit-toggle"
                                  onClick={() => setIsForUnitOpen(!isForUnitOpen)}
                                  isExpanded={isForUnitOpen}
                                >
                                  {forUnit}
                                </MenuToggle>
                              )}
                            >
                              <SelectList>
                                <SelectOption value="Hours">Hours</SelectOption>
                                <SelectOption value="Days">Days</SelectOption>
                                <SelectOption value="Weeks">Weeks</SelectOption>
                              </SelectList>
                            </Select>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </StackItem>
                <StackItem>
                  <Radio
                    id="silence-until"
                    className="silence-rule-form__duration-radio-row"
                    name="silence-duration-kind"
                    label="Until"
                    isChecked={durationKind === 'until'}
                    onChange={() => setDurationKind('until')}
                    body={
                      <div className="silence-rule-form__for-duration">
                        <div className="silence-rule-form__until-row">
                          <TextInput
                            type="date"
                            className="silence-rule-form__input-date"
                            placeholder="YYYY-MM-DD"
                            value={untilDate}
                            onChange={(_, v) => setUntilDate(v)}
                            isDisabled={durationKind !== 'until'}
                            aria-label="Silence end date"
                          />
                          <TextInput
                            type="time"
                            className="silence-rule-form__input-time"
                            placeholder="HH:MM"
                            value={untilTime}
                            onChange={(_, v) => setUntilTime(v)}
                            isDisabled={durationKind !== 'until'}
                            aria-label="Silence end time"
                          />
                        </div>
                      </div>
                    }
                  />
                </StackItem>
              </Stack>
            </FormGroup>
          </Form>
        </StackItem>

        <StackItem className="silence-rule-form__section--matchers">
          <Title className="silence-rule-form__section-heading" headingLevel="h3" size="md">
            Define label matchers
          </Title>
          <Content component="p" style={{ marginTop: 8, marginBottom: 12, color: 'var(--pf-t--global--text--color--subtle)' }}>
            Alerts with labels that match these selectors will be silenced instead of firing. Label values can be matched exactly or with a regular expression.
          </Content>
          {matchers.map((m, idx) => (
            <div key={m.id} className="silence-rule-form__matcher-grid">
              <div>
                <FormGroup label={<>Label value{idx === 0 ? <RequiredMark /> : null}</>} fieldId={`lv-${m.id}`}>
                  <TextInput
                    id={`lv-${m.id}`}
                    placeholder="Input field"
                    value={m.labelValue}
                    onChange={(_, v) => setMatchers((prev) => prev.map((x) => (x.id === m.id ? { ...x, labelValue: v } : x)))}
                    required={idx === 0}
                    aria-required={idx === 0}
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup label={<>Label name{idx === 0 ? <RequiredMark /> : null}</>} fieldId={`ln-${m.id}`}>
                  <TextInput
                    id={`ln-${m.id}`}
                    placeholder="Input field"
                    value={m.labelName}
                    onChange={(_, v) => setMatchers((prev) => prev.map((x) => (x.id === m.id ? { ...x, labelName: v } : x)))}
                    required={idx === 0}
                    aria-required={idx === 0}
                  />
                </FormGroup>
              </div>
              <div className="silence-rule-form__cell-remove">
                <Button
                  variant="plain"
                  aria-label="Remove label matcher row"
                  isDisabled={matchers.length === 1}
                  onClick={() => setMatchers((prev) => prev.filter((x) => x.id !== m.id))}
                >
                  <MinusCircleIcon />
                </Button>
              </div>
              <div className="silence-rule-form__cell-query" role="group" aria-labelledby={`qu-label-${m.id}`}>
                <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                  <span id={`qu-label-${m.id}`} className="silence-rule-form__query-inline-label">
                    Query using:{idx === 0 ? <RequiredMark /> : null}
                  </span>
                  <Checkbox
                    id={`regex-${m.id}`}
                    label="RegEx"
                    isChecked={m.isRegex}
                    onChange={(_, c) => setMatchers((prev) => prev.map((x) => (x.id === m.id ? { ...x, isRegex: c } : x)))}
                  />
                  <Checkbox
                    id={`neg-${m.id}`}
                    label="Negative matcher"
                    isChecked={m.isNegative}
                    onChange={(_, c) => setMatchers((prev) => prev.map((x) => (x.id === m.id ? { ...x, isNegative: c } : x)))}
                  />
                </Flex>
              </div>
            </div>
          ))}
          <div className="silence-rule-form__add-row">
            <Button
              variant="link"
              icon={<PlusCircleIcon />}
              onClick={() =>
                setMatchers((prev) => [
                  ...prev,
                  { id: `m-${Date.now()}`, labelValue: '', labelName: '', isRegex: false, isNegative: false },
                ])
              }
            >
              Add label selectors
            </Button>
          </div>
        </StackItem>

      <StackItem className="silence-rule-form__section--comment">
        <Title
          id="silence-comment-heading"
          className="silence-rule-form__section-heading"
          headingLevel="h3"
          size="md"
        >
          Comment
        </Title>
        <TextArea
          id="silence-comment"
          aria-labelledby="silence-comment-heading"
          placeholder="Silence summary here"
          value={comment}
          onChange={(_, v) => setComment(v)}
          rows={4}
          className="silence-rule-form__comment-textarea"
        />
      </StackItem>

      {showTargetClusters && (
        <StackItem>
          <Title className="silence-rule-form__section-heading" headingLevel="h3" size="md">
            Target clusters
          </Title>
        <Content component="p" style={{ marginTop: 8, marginBottom: 16, color: 'var(--pf-t--global--text--color--subtle)' }}>
          Define which clusters the alert rule applies to.
        </Content>
        <FormGroup fieldId="silence-apply-to">
          <Radio
            id="silence-all-clusters"
            name="silence-target"
            label={`All clusters (${FLEET_CLUSTER_COUNT})`}
            description="Apply the rule fleet-wide without selecting individual clusters."
            isChecked={targetAllClusters}
            onChange={() => setTargetAllClusters(true)}
          />
          <Radio
            id="silence-specific-clusters"
            name="silence-target"
            label="Specific clusters"
            description="Pick clusters from the fleet table."
            isChecked={!targetAllClusters}
            onChange={() => setTargetAllClusters(false)}
          />
        </FormGroup>
        {!targetAllClusters && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
              borderRadius: 24,
            }}
          >
            <TextInput
              id="silence-cluster-search"
              placeholder="Search by cluster name"
              value={clusterSearch}
              onChange={(_, v) => setClusterSearch(v)}
              style={{ marginBottom: 12, width: '100%' }}
              aria-label="Filter clusters by name"
            />
            <div style={{ maxHeight: 280, overflow: 'auto', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: 24 }}>
              <Table aria-label="Silence target clusters" variant="compact">
                <Thead>
                  <Tr>
                    <Th screenReaderText="Select" />
                    <Th>Name</Th>
                    <Th>Labels</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredFleet.slice(0, 25).map((c) => (
                    <Tr key={c.name}>
                      <Td>
                        <Checkbox
                          id={`sc-${c.name}`}
                          isChecked={selectedClusters.includes(c.name)}
                          onChange={(_, checked) => {
                            if (checked) setSelectedClusters([...selectedClusters, c.name]);
                            else setSelectedClusters(selectedClusters.filter((n) => n !== c.name));
                          }}
                          aria-label={`Select ${c.name}`}
                        />
                      </Td>
                      <Td>{c.name}</Td>
                      <Td>
                        <Tooltip
                          content={Object.entries(c.labels)
                            .map(([k, v]) => `${k}=${v}`)
                            .join('\n')}
                        >
                          <span tabIndex={0} style={{ cursor: 'default', textDecoration: 'underline dotted' }}>
                            {Object.keys(c.labels).length} labels
                          </span>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
            <Content component="small" style={{ display: 'block', marginTop: 8, color: 'var(--pf-t--global--text--color--subtle)' }}>
              Showing first 25 clusters matching search.
            </Content>
          </div>
        )}
        </StackItem>
      )}

      <StackItem>
        <Flex
          gap={{ default: 'gapMd' }}
          alignItems={{ default: 'alignItemsCenter' }}
          className="silence-rule-form__footer-actions"
        >
          <Button variant="primary" onClick={onSubmit}>
            {mode === 'create' ? 'Create silence' : 'Save changes'}
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </Flex>
      </StackItem>
    </Stack>
    </div>
  );
};
