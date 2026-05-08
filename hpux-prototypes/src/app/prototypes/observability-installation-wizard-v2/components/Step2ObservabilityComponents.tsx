import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Radio,
  Grid,
  GridItem,
  Checkbox,
  Stack,
  StackItem,
  Divider,
  Alert,
  AlertVariant,
  AlertActionCloseButton,
  Flex,
  FlexItem,
  Switch,
  Badge,
  Label,
  HelperText,
  HelperTextItem,
  Spinner,
} from '@patternfly/react-core';
import {
  UserIcon,
  ChartLineIcon,
  CodeIcon,
} from '@patternfly/react-icons';

export interface Persona {
  id: string;
  name: string;
  icon: React.ReactNode;
  focus: string;
  description: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  required?: boolean;
  dependencies?: string[];
  requiresHighPerformanceStorage?: boolean;
  nestedOptions?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export interface WizardData {
  // Step 1 data
  installationNamespace?: string;
  selectedProject?: string;
  installationMode?: string;
  updateChannel?: string;
  version?: string;
  updateApproval?: string;
  enableClusterMonitoring?: boolean;
  // Step 2 data
  selectedPersona: string | null; // Deprecated, kept for backward compatibility
  activeGoals: string[]; // New: array of selected goal IDs
  selectedCapabilities: string[];
  selectedNestedOptions: { [capabilityId: string]: string[] };
  advancedMode: boolean;
  selectedUIPlugins: string[];
  selectedStorage: string[]; // Selected storage options (ODF or LVM)
  operatorVersions?: { [capabilityId: string]: { version: string; channel: string } }; // Version and channel for each selected operator
  storageVersions?: { [storageId: string]: { version: string; channel: string } }; // Version and channel for each selected storage
}

interface Step2ObservabilityComponentsProps {
  data: WizardData;
  onDataChange: (data: Partial<WizardData>) => void;
}

// Goals (replaces personas with checkbox selection)
export interface Goal {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

type GoalID = 'platform-governance' | 'incident-response' | 'app-performance';

const STRATEGY_CARD_COLORS: Record<GoalID, string> = {
  'platform-governance': '#cbc1ff', // --pf-v6-chart-color-purple-100 fallback
  'incident-response': '#7ccdd4',  // --pf-v6-chart-color-teal-100 fallback
  'app-performance': '#f4b678',    // --pf-v6-chart-color-orange-100 fallback
};

/** PatternFly Label color per strategy (purple / teal / orange align with strategy cards) */
const STRATEGY_LABEL_COLOR: Record<GoalID, 'purple' | 'teal' | 'orange'> = {
  'platform-governance': 'purple',
  'incident-response': 'teal',
  'app-performance': 'orange',
};

const goals: Goal[] = [
  {
    id: 'platform-governance',
    name: 'Platform governance & stability',
    icon: <UserIcon />,
    description: 'Monitor infrastructure health, audit logs, enforce network policies, and manage long-term capacity planning.',
  },
  {
    id: 'incident-response',
    name: 'Incident response & reliability',
    icon: <ChartLineIcon />,
    description: 'Maximize uptime and reduce MTTR using full-stack debugging, distributed tracing, and automated signal correlation.',
  },
  {
    id: 'app-performance',
    name: 'App performance & debugging',
    icon: <CodeIcon />,
    description: 'Isolate code errors, trace transactions across microservices, and optimize application latency within namespaces.',
  },
];

// Dependency map: Each goal requires specific operators and storage
interface GoalDependencies {
  operators: string[]; // Operator IDs (capability IDs)
  storage: string[]; // Storage IDs: 'odf' or 'lvm'
}

const NEED_DEPENDENCIES: Record<GoalID, GoalDependencies> = {
  'platform-governance': {
    operators: ['metrics-alerting', 'thanos', 'loki'],
    storage: ['odf'], // Platform governance requires ODF
  },
  'incident-response': {
    operators: ['metrics-alerting', 'thanos', 'loki', 'tempo', 'korrel8r', 'incident-detection'],
    storage: ['odf'], // Incident response requires ODF
  },
  'app-performance': {
    operators: ['metrics-alerting', 'loki', 'tempo'],
    storage: ['lvm'], // App performance can use LVM
  },
};

// Default versions and channels for operators
const OPERATOR_VERSIONS: Record<string, { version: string; channel: string }> = {
  'metrics-alerting': { version: '1.3.1', channel: 'stable' },
  'thanos': { version: '0.40.0', channel: 'stable' },
  'loki': { version: '5.8.1', channel: 'stable-5.8' },
  'tempo': { version: '2.5.0', channel: 'stable-2.5' },
  'opentelemetry': { version: '0.95.0', channel: 'stable' },
  'network-traffic': { version: '1.2.0', channel: 'stable' },
  'korrel8r': { version: '0.8.0', channel: 'stable' },
  'incident-detection': { version: '1.0.0', channel: 'stable' },
};

// Default versions and channels for storage
const STORAGE_VERSIONS: Record<string, { version: string; channel: string }> = {
  'odf': { version: '4.16.0', channel: 'stable-4.16' },
  'lvm': { version: '4.15.0', channel: 'stable-4.15' },
};

// Legacy personas (kept for backward compatibility during migration)
const personas: Persona[] = [
  {
    id: 'administrator',
    name: 'Platform governance & stability',
    icon: <UserIcon />,
    focus: 'Governance & Compliance',
    description: 'Monitor infrastructure health, audit logs, enforce network policies, and manage long-term capacity planning.',
  },
  {
    id: 'sre',
    name: 'Incident response & reliability',
    icon: <ChartLineIcon />,
    focus: 'Reliability & MTTR',
    description: 'Maximize uptime and reduce MTTR using full-stack debugging, distributed tracing, and automated signal correlation.',
  },
  {
    id: 'developer',
    name: 'App performance & debugging',
    icon: <CodeIcon />,
    focus: 'App Debugging & Tracing',
    description: 'Isolate code errors, trace transactions across microservices, and optimize application latency within namespaces.',
  },
];

const capabilities: Capability[] = [
  {
    id: 'metrics-alerting',
    name: 'Core Observability (Prometheus)',
    description: 'The engine for metrics collection, alerting rules, and base dashboards.',
    required: true,
  },
  {
    id: 'thanos',
    name: 'Long-term Storage (Thanos)',
    description: 'Retain metrics for capacity planning and historical analysis. (Requires S3-compatible object storage)',
  },
  {
    id: 'loki',
    name: 'Centralized Logging (Loki)',
    description: 'Aggregate and search logs across the cluster.',
    nestedOptions: [
      {
        id: 'infrastructure-logs',
        name: 'Infrastructure logs',
        description: 'Node, API server, and control plane logs.',
      },
      {
        id: 'application-logs',
        name: 'Application logs',
        description: 'Container stdout/stderr from workloads.',
      },
    ],
  },
  {
    id: 'incident-detection',
    name: 'Incident Detection (Native)',
    description: 'Automatically groups related alerts into incidents to reduce alert fatigue and highlight root causes.',
  },
  {
    id: 'tempo',
    name: 'Distributed Tracing (Tempo)',
    description: 'Track requests across microservices for latency analysis.',
  },
  {
    id: 'opentelemetry',
    name: 'Telemetry Pipeline (OpenTelemetry)',
    description: 'Handles telemetry collection and auto-instrumentation.',
    nestedOptions: [
      {
        id: 'auto-instrumentation',
        name: 'Enable Auto-Instrumentation',
        description: '',
      },
    ],
  },
  {
    id: 'network-traffic',
    name: 'Network Traffic Analysis (NetObserve)',
    description: 'Visualize pod-to-pod traffic and debug connection issues.',
    dependencies: ['loki', 'metrics-alerting'],
    requiresHighPerformanceStorage: true,
  },
  {
    id: 'korrel8r',
    name: 'Signal Correlation (Korrel8r)',
    description: 'Automated root cause analysis linking logs, metrics, and traces.',
  },
];

interface UIPlugin {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  dependencies?: string[];
}

const uiPlugins: UIPlugin[] = [
  {
    id: 'monitoring-ui',
    name: 'Monitoring UI Plugin (Metrics)',
    description: 'Adds the Metrics, Alerting, and Incidents pages to the Observe menu.',
    defaultEnabled: true,
    dependencies: ['metrics-alerting'],
  },
  {
    id: 'logging-ui',
    name: 'Logging UI Plugin (Logs)',
    description: 'Log exploration.',
    defaultEnabled: false,
    dependencies: ['loki'],
  },
  {
    id: 'tracing-ui',
    name: 'Tracing UI Plugin (Traces)',
    description: 'Distributed traces.',
    defaultEnabled: false,
    dependencies: ['tempo'],
  },
  {
    id: 'troubleshooting-panel',
    name: 'Troubleshooting Panel UI (Signal correlation)',
    description: 'Signal correlation.',
    defaultEnabled: false,
    dependencies: ['korrel8r'],
  },
  {
    id: 'perses',
    name: 'Custom dashboards UI (Perses)',
    description: 'Enables the Perses dashboard engine for creating and visualizing custom metrics and dashboards directly in the Console.',
    defaultEnabled: false,
    dependencies: ['metrics-alerting'],
  },
  {
    id: 'incident-detection-ui',
    name: 'Incident Detection UI Plugin (Alerts)',
    description: 'Incident detection and alerting.',
    defaultEnabled: false,
    dependencies: ['loki'],
  },
  {
    id: 'network-ui',
    name: 'Network UI Plugin (Flows)',
    description: 'Network traffic visualization.',
    defaultEnabled: false,
    dependencies: ['network-traffic'],
  },
];

// Operator/Storage item with dependency tracking
interface OperatorStorageItem {
  id: string;
  name: string;
  description?: string;
  isSelected: boolean;
  isLocked: boolean; // Core Observability is always locked
  appliedBy: GoalID[]; // Which goals require this item
  version?: string; // Operator version (e.g., "5.8.1")
  channel?: string; // Update channel (e.g., "stable-5.8")
  isUpdating?: boolean; // Simulates "Fetching latest version" state
}

export const Step2ObservabilityComponents: React.FC<Step2ObservabilityComponentsProps> = ({
  data,
  onDataChange,
}) => {
  // Goals-based state (new system)
  const [activeGoals, setActiveGoals] = useState<string[]>(data.activeGoals || []);
  
  // Legacy persona state (for backward compatibility)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(data.selectedPersona);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(data.selectedCapabilities);
  const [selectedNestedOptions, setSelectedNestedOptions] = useState<{ [key: string]: string[] }>(
    data.selectedNestedOptions || {}
  );
  const [advancedMode, setAdvancedMode] = useState(data.advancedMode || false);
  const [selectedUIPlugins, setSelectedUIPlugins] = useState<string[]>(
    data.selectedUIPlugins || ['monitoring-ui']
  );
  const [isPreselectionAlertDismissed, setIsPreselectionAlertDismissed] = useState(false);
  
  // Track manually unchecked items that were required by goals
  const [uncheckedRequiredItems, setUncheckedRequiredItems] = useState<Set<string>>(new Set());
  
  // Track goals that were overridden due to manual changes (for visual feedback)
  const [overriddenGoals, setOverriddenGoals] = useState<Set<string>>(new Set());
  
  // Ref to track when we're manually removing goals (to prevent full reset)
  const isManualOverrideRef = useRef(false);

  // Initialize operators and storage items from capabilities
  const initialOperators: OperatorStorageItem[] = useMemo(() => {
    return capabilities.map(cap => {
      const versionInfo = OPERATOR_VERSIONS[cap.id] || { version: '1.0.0', channel: 'stable' };
      return {
        id: cap.id,
        name: cap.name,
        description: cap.description,
        isSelected: cap.required || false, // Core Observability (metrics-alerting) is required
        isLocked: cap.required || false, // Core Observability is locked
        appliedBy: [],
        version: versionInfo.version,
        channel: versionInfo.channel,
        isUpdating: false,
      };
    });
  }, []);

  // Initialize storage items
  const initialStorage: OperatorStorageItem[] = useMemo(() => [
    {
      id: 'odf',
      name: 'OpenShift Data Foundation (ODF)',
      description: 'Enterprise-grade storage for demanding observability requirements.',
      isSelected: false,
      isLocked: false,
      appliedBy: [],
      version: STORAGE_VERSIONS.odf.version,
      channel: STORAGE_VERSIONS.odf.channel,
      isUpdating: false,
    },
    {
      id: 'lvm',
      name: 'Logical Volume Manager (LVM)',
      description: 'Provides local storage for metrics and logs. Requires external S3-compatible storage if Long-term Storage (Thanos) is enabled.',
      isSelected: false,
      isLocked: false,
      appliedBy: [],
      version: STORAGE_VERSIONS.lvm.version,
      channel: STORAGE_VERSIONS.lvm.channel,
      isUpdating: false,
    },
  ], []);

  // State for operators and storage with dependency tracking
  const [operators, setOperators] = useState<OperatorStorageItem[]>(initialOperators);
  const [storage, setStorage] = useState<OperatorStorageItem[]>(initialStorage);

  // Dependency calculation: Updates operators and storage based on activeGoals
  const updateDependencies = useCallback((goalIds: string[]) => {
    // Reset all to default (except Core Observability which is locked)
    // Preserve version, channel, and set isUpdating to false
    const newOperators: OperatorStorageItem[] = initialOperators.map(item => ({
      ...item,
      isSelected: item.isLocked, // Only locked items remain selected
      appliedBy: [] as GoalID[],
      isUpdating: false, // Reset updating state
    }));

    const newStorage: OperatorStorageItem[] = initialStorage.map(item => ({
      ...item,
      isSelected: false,
      appliedBy: [] as GoalID[],
      isUpdating: false, // Reset updating state
    }));

    // Aggregate requirements from all active goals
    goalIds.forEach(goalId => {
      const deps = NEED_DEPENDENCIES[goalId as GoalID];
      if (!deps) return;

      // Add required operators
      deps.operators.forEach(opId => {
        const item = newOperators.find(i => i.id === opId);
        if (item && !item.isLocked) {
          item.isSelected = true;
          // Type-safe: appliedBy is GoalID[]
          if (!item.appliedBy.includes(goalId as GoalID)) {
            item.appliedBy.push(goalId as GoalID);
          }
        }
      });

      // Add required storage
      deps.storage.forEach(storageId => {
        const item = newStorage.find(i => i.id === storageId);
        if (item) {
          item.isSelected = true;
          if (!item.appliedBy.includes(goalId as GoalID)) {
            item.appliedBy.push(goalId as GoalID);
          }
        }
      });
    });

    // Conflict Resolution: ODF overrides LVM
    const hasODF = newStorage.find(i => i.id === 'odf')?.isSelected;
    const hasLVM = newStorage.find(i => i.id === 'lvm')?.isSelected;
    
    if (hasODF && hasLVM) {
      // ODF takes priority - remove LVM requirement
      const lvmItem = newStorage.find(i => i.id === 'lvm');
      if (lvmItem) {
        lvmItem.isSelected = false;
        // Keep only ODF-requiring goals in LVM's appliedBy (for display purposes)
        // Actually, we should remove LVM entirely when ODF is selected
        lvmItem.appliedBy = [];
      }
    }

    return { operators: newOperators, storage: newStorage };
  }, [initialOperators, initialStorage]);

  // Update dependencies when activeGoals change (but not during manual overrides)
  useEffect(() => {
    // Skip reset if this is a manual override (user unchecking something)
    if (isManualOverrideRef.current) {
      isManualOverrideRef.current = false; // Reset the flag
      return; // Don't reset everything, just keep current state
    }

    const { operators: newOperators, storage: newStorage } = updateDependencies(activeGoals);
    setOperators(newOperators);
    setStorage(newStorage);

    // Update selectedCapabilities based on selected operators
    const newCapabilities = newOperators
      .filter(op => op.isSelected)
      .map(op => op.id);
    
    setSelectedCapabilities(newCapabilities);
    
    // Update selectedStorage based on selected storage items
    const newSelectedStorage = newStorage
      .filter(s => s.isSelected)
      .map(s => s.id);
    
    // Build version maps for selected operators and storage
    const operatorVersions: { [key: string]: { version: string; channel: string } } = {};
    newOperators
      .filter(op => op.isSelected && op.version && op.channel)
      .forEach(op => {
        operatorVersions[op.id] = { version: op.version!, channel: op.channel! };
      });
    
    const storageVersions: { [key: string]: { version: string; channel: string } } = {};
    newStorage
      .filter(s => s.isSelected && s.version && s.channel)
      .forEach(s => {
        storageVersions[s.id] = { version: s.version!, channel: s.channel! };
      });
    
    onDataChange({ 
      activeGoals,
      selectedCapabilities: newCapabilities,
      selectedStorage: newSelectedStorage,
      operatorVersions,
      storageVersions
    });
  }, [activeGoals, updateDependencies, onDataChange]);

  // Auto-select UI plugins based on goals and selected capabilities
  useEffect(() => {
    // Only auto-select if we have goals or capabilities (not just on initial mount with empty state)
    if (activeGoals.length > 0 || (selectedCapabilities.length > 0 && selectedCapabilities.includes('metrics-alerting'))) {
      let autoUIPlugins: string[] = [];
      
      // monitoring-ui requires metrics-alerting (always auto-selected when dependency is met)
      if (selectedCapabilities.includes('metrics-alerting')) {
        autoUIPlugins.push('monitoring-ui');
      }
      
      // logging-ui requires loki (auto-selected when dependency is met)
      if (selectedCapabilities.includes('loki')) {
        autoUIPlugins.push('logging-ui');
      }
      
      // tracing-ui requires tempo (auto-selected when dependency is met)
      if (selectedCapabilities.includes('tempo')) {
        autoUIPlugins.push('tracing-ui');
      }
      
      // troubleshooting-panel requires korrel8r (auto-selected when dependency is met)
      if (selectedCapabilities.includes('korrel8r')) {
        autoUIPlugins.push('troubleshooting-panel');
      }
      
      // Perses requires metrics-alerting and is auto-selected for Platform Governance and Incident Response goals
      if (selectedCapabilities.includes('metrics-alerting') && 
          (activeGoals.includes('platform-governance') || activeGoals.includes('incident-response'))) {
        autoUIPlugins.push('perses');
      }
      
      // Incident Detection UI Plugin requires loki and is auto-selected for Incident Response goal
      if (selectedCapabilities.includes('loki') && activeGoals.includes('incident-response')) {
        autoUIPlugins.push('incident-detection-ui');
      }
      
      // Network UI Plugin requires network-traffic and is auto-selected when network-traffic is selected
      if (selectedCapabilities.includes('network-traffic')) {
        autoUIPlugins.push('network-ui');
      }
      
      // When goals/capabilities change, only keep plugins that should be auto-selected
      // Don't preserve manually-selected plugins unless Advanced Mode is enabled
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentPlugins = selectedUIPlugins;
      const finalPlugins = advancedMode 
        ? // In Advanced Mode, preserve manually-selected plugins that aren't auto-selected
          [...autoUIPlugins, ...currentPlugins.filter(pluginId => !autoUIPlugins.includes(pluginId))]
        : // In normal mode, only use auto-selected plugins
          autoUIPlugins;
      
      // Remove duplicates
      const uniquePlugins = Array.from(new Set(finalPlugins));
      
      setSelectedUIPlugins(uniquePlugins);
      onDataChange({ selectedUIPlugins: uniquePlugins });
    }
  }, [activeGoals, selectedCapabilities, advancedMode, onDataChange]);

  // Sync data prop changes to local state when props change
  // This ensures local state stays in sync if user navigates away and back
  useEffect(() => {
    if (data.activeGoals) {
      setActiveGoals(data.activeGoals);
    }
  }, [data.activeGoals]);

  useEffect(() => {
    setSelectedPersona(data.selectedPersona);
  }, [data.selectedPersona]);

  useEffect(() => {
    setSelectedCapabilities(data.selectedCapabilities);
  }, [data.selectedCapabilities]);

  useEffect(() => {
    setSelectedNestedOptions(data.selectedNestedOptions || {});
  }, [data.selectedNestedOptions]);

  useEffect(() => {
    setAdvancedMode(data.advancedMode || false);
  }, [data.advancedMode]);

  useEffect(() => {
    setSelectedUIPlugins(data.selectedUIPlugins || ['monitoring-ui']);
  }, [data.selectedUIPlugins]);

  // Auto-select capabilities based on persona
  // Note: We intentionally read selectedCapabilities here without including it in dependencies
  // because we only want this effect to run when persona changes, not when capabilities change.
  // We read the current value to preserve manually-selected capabilities when switching personas.
  useEffect(() => {
    if (selectedPersona) {
      // Define persona-specific capabilities (these will be replaced when persona changes)
      const personaSpecificCapabilities = ['thanos', 'loki', 'tempo', 'korrel8r', 'incident-detection'];
      
      // Start with required capabilities
      let autoCapabilities: string[] = ['metrics-alerting']; // Always required
      
      // Add persona-specific capabilities
      if (selectedPersona === 'administrator') {
        autoCapabilities.push('thanos', 'loki');
      } else if (selectedPersona === 'sre') {
        autoCapabilities.push('thanos', 'loki', 'tempo', 'korrel8r', 'incident-detection');
      } else if (selectedPersona === 'developer') {
        autoCapabilities.push('loki', 'tempo');
      }
      
      // Preserve manually-selected capabilities that are NOT persona-specific
      // (e.g., network-traffic which can be manually selected)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const manuallySelected = selectedCapabilities.filter(
        cap => !personaSpecificCapabilities.includes(cap) && cap !== 'metrics-alerting'
      );
      
      // Merge persona auto-capabilities with manually-selected ones
      const mergedCapabilities = [...autoCapabilities, ...manuallySelected];
      // Remove duplicates
      const uniqueCapabilities = Array.from(new Set(mergedCapabilities));
      
      setSelectedCapabilities(uniqueCapabilities);
      onDataChange({ selectedCapabilities: uniqueCapabilities });
      
      // Auto-select UI plugins based on persona and dependencies
      // Only add plugins if their dependencies are satisfied
      let autoUIPlugins: string[] = [];
      
      // monitoring-ui requires metrics-alerting (always auto-selected when dependency is met)
      if (uniqueCapabilities.includes('metrics-alerting')) {
        autoUIPlugins.push('monitoring-ui');
      }
      
      // logging-ui requires loki (auto-selected when dependency is met)
      if (uniqueCapabilities.includes('loki')) {
        autoUIPlugins.push('logging-ui');
      }
      
      // tracing-ui requires tempo (auto-selected when dependency is met)
      if (uniqueCapabilities.includes('tempo')) {
        autoUIPlugins.push('tracing-ui');
      }
      
      // troubleshooting-panel requires korrel8r (auto-selected when dependency is met)
      if (uniqueCapabilities.includes('korrel8r')) {
        autoUIPlugins.push('troubleshooting-panel');
      }
      
      // Perses requires metrics-alerting and is auto-selected for Administrator and SRE personas
      if (uniqueCapabilities.includes('metrics-alerting') && 
          (selectedPersona === 'administrator' || selectedPersona === 'sre')) {
        autoUIPlugins.push('perses');
      }
      
      // Incident Detection UI Plugin requires loki and is auto-selected for SRE persona
      if (uniqueCapabilities.includes('loki') && selectedPersona === 'sre') {
        autoUIPlugins.push('incident-detection-ui');
      }
      
      // Network UI Plugin requires network-traffic and is auto-selected when network-traffic is selected
      if (uniqueCapabilities.includes('network-traffic')) {
        autoUIPlugins.push('network-ui');
      }
      
      // When persona changes, only keep plugins that should be auto-selected for this persona
      // Don't preserve manually-selected plugins unless Advanced Mode is enabled
      // This ensures persona-specific plugin selections are accurate
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const finalPlugins = advancedMode 
        ? // In Advanced Mode, preserve manually-selected plugins that aren't auto-selected
          [...autoUIPlugins, ...selectedUIPlugins.filter(pluginId => !autoUIPlugins.includes(pluginId))]
        : // In normal mode, only use auto-selected plugins for this persona
          autoUIPlugins;
      
      // Remove duplicates
      const uniquePlugins = Array.from(new Set(finalPlugins));
      
      setSelectedUIPlugins(uniquePlugins);
      onDataChange({ selectedUIPlugins: uniquePlugins });
    }
  }, [selectedPersona, advancedMode, onDataChange]);

  // Check if current selections match a strategy's requirements
  const checkIfSelectionMatchesStrategy = useCallback((goalId: GoalID, currentOperators: OperatorStorageItem[], currentStorage: OperatorStorageItem[]): boolean => {
    const deps = NEED_DEPENDENCIES[goalId];
    if (!deps) return false;

    // Check if all required operators are selected
    const requiredOperatorsSelected = deps.operators.every(opId => {
      const operator = currentOperators.find(op => op.id === opId);
      return operator?.isSelected === true;
    });

    // Check if required storage is selected
    const requiredStorageSelected = deps.storage.every(storageId => {
      const storageItem = currentStorage.find(s => s.id === storageId);
      return storageItem?.isSelected === true;
    });

    // Check if no extra operators are selected that aren't in the strategy
    // (This is optional - you might want to allow extra operators)
    // For now, we'll just check that required items are selected

    return requiredOperatorsSelected && requiredStorageSelected;
  }, []);

  // Check if any active goal no longer matches current selections
  // Returns true if mismatches were found and handled
  const checkAndRemoveMismatchedGoals = useCallback((currentOperators: OperatorStorageItem[], currentStorage: OperatorStorageItem[]): boolean => {
    const mismatchedGoals: string[] = [];
    
    activeGoals.forEach(goalId => {
      const matches = checkIfSelectionMatchesStrategy(goalId as GoalID, currentOperators, currentStorage);
      if (!matches) {
        mismatchedGoals.push(goalId);
      }
    });

    if (mismatchedGoals.length > 0) {
      // Set flag BEFORE state update to prevent full reset - we only want to uncheck the strategy, not reset everything
      isManualOverrideRef.current = true;
      
      const newGoals = activeGoals.filter(id => !mismatchedGoals.includes(id));
      
      // Update appliedBy arrays to remove overridden goals (for badge display)
      const updatedOperators = currentOperators.map(op => ({
        ...op,
        appliedBy: op.appliedBy.filter(goalId => !mismatchedGoals.includes(goalId)) as GoalID[]
      }));
      const updatedStorage = currentStorage.map(s => ({
        ...s,
        appliedBy: s.appliedBy.filter(goalId => !mismatchedGoals.includes(goalId)) as GoalID[]
      }));
      
      // Update operators and storage with cleaned appliedBy arrays
      setOperators(updatedOperators);
      setStorage(updatedStorage);
      
      setActiveGoals(newGoals);
      onDataChange({ activeGoals: newGoals });
      
      // Track overridden goals for visual feedback
      setOverriddenGoals(prev => {
        const newSet = new Set(prev);
        mismatchedGoals.forEach(goalId => newSet.add(goalId));
        return newSet;
      });
      
      return true; // Mismatches were found and handled
    }
    
    return false; // No mismatches
  }, [activeGoals, checkIfSelectionMatchesStrategy, onDataChange]);

  // Handle goal selection (checkboxes) - idempotent: always resets to factory defaults
  const handleGoalChange = (goalId: string, checked: boolean) => {
    if (checked) {
      // Set updating state for all operators/storage to simulate "checking catalog"
      setOperators(prev => prev.map(op => ({ ...op, isUpdating: true })));
      setStorage(prev => prev.map(s => ({ ...s, isUpdating: true })));
      
      // Simulate catalog check delay (500ms)
      setTimeout(() => {
        // Re-apply strategy: reset to factory defaults for this goal
        // This will trigger the useEffect that calls updateDependencies
        const newGoals = [...activeGoals, goalId];
        setActiveGoals(newGoals);
        onDataChange({ activeGoals: newGoals });
        
        // Remove from overridden goals when re-applying
        setOverriddenGoals(prev => {
          const newSet = new Set(prev);
          newSet.delete(goalId);
          return newSet;
        });
      }, 500);
    } else {
      // Remove goal
      const newGoals = activeGoals.filter(id => id !== goalId);
      setActiveGoals(newGoals);
      onDataChange({ activeGoals: newGoals });
    }
  };

  // Handle operator/storage selection with warning for required items
  const handleOperatorChange = (operatorId: string, checked: boolean) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator) return;

    // Prevent unchecking locked items (Core Observability)
    if (!checked && operator.isLocked) {
      return;
    }

    // Check if this operator is required by any active goal
    if (!checked && operator.appliedBy.length > 0) {
      // Show warning - add to uncheckedRequiredItems
      setUncheckedRequiredItems(prev => new Set([...Array.from(prev), operatorId]));
    } else {
      // Remove from uncheckedRequiredItems if being checked
      setUncheckedRequiredItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(operatorId);
        return newSet;
      });
    }

    // Update operator selection
    const newOperators = operators.map(op => 
      op.id === operatorId ? { ...op, isSelected: checked } : op
    );
    
    // Update selectedCapabilities
    const newCapabilities = newOperators
      .filter(op => op.isSelected)
      .map(op => op.id);
    setSelectedCapabilities(newCapabilities);
    
    // Build version map for selected operators
    const operatorVersions: { [key: string]: { version: string; channel: string } } = {};
    newOperators
      .filter(op => op.isSelected && op.version && op.channel)
      .forEach(op => {
        operatorVersions[op.id] = { version: op.version!, channel: op.channel! };
      });
    
    onDataChange({ 
      selectedCapabilities: newCapabilities,
      operatorVersions 
    });

    // Check if manual override occurred - if selections no longer match active strategies, remove them
    // This will uncheck the strategy but keep everything else as-is (only the unchecked item changes)
    // checkAndRemoveMismatchedGoals will update operators/storage if goals are removed
    const hadMismatches = checkAndRemoveMismatchedGoals(newOperators, storage);
    
    // Only set operators if no mismatches were found (otherwise checkAndRemoveMismatchedGoals already set them)
    if (!hadMismatches) {
      setOperators(newOperators);
    }
  };

  const handleStorageChange = (storageId: string, checked: boolean) => {
    const storageItem = storage.find(s => s.id === storageId);
    if (!storageItem) return;

    // ODF and LVM are mutually exclusive - only one can be selected at a time
    if (checked) {
      // Selecting a storage option - uncheck the other one
      const otherStorageId = storageId === 'odf' ? 'lvm' : 'odf';
      const otherStorage = storage.find(s => s.id === otherStorageId);
      const wasOtherRequired = otherStorage && otherStorage.appliedBy.length > 0;
      
      // Update uncheckedRequiredItems: remove selected storage, add/remove other storage based on requirement
      setUncheckedRequiredItems(prev => {
        const newSet = new Set(prev);
        // Remove the selected storage from warnings (it's now selected, so no warning needed)
        newSet.delete(storageId);
        // Add the other storage to warnings if it was required, otherwise remove it
        if (wasOtherRequired) {
          newSet.add(otherStorageId);
        } else {
          newSet.delete(otherStorageId);
        }
        return newSet;
      });
      
      const newStorage = storage.map(s => {
        if (s.id === storageId) {
          // Select the clicked item
          return { ...s, isSelected: true };
        } else if (s.id === otherStorageId) {
          // Uncheck the other storage option
          return { ...s, isSelected: false };
        }
        return s;
      });
      
      // Update selectedStorage in wizard data
      const newSelectedStorage = newStorage
        .filter(s => s.isSelected)
        .map(s => s.id);
      
      // Build version map for selected storage
      const storageVersions: { [key: string]: { version: string; channel: string } } = {};
      newStorage
        .filter(s => s.isSelected && s.version && s.channel)
        .forEach(s => {
          storageVersions[s.id] = { version: s.version!, channel: s.channel! };
        });
      
      onDataChange({ 
        selectedStorage: newSelectedStorage,
        storageVersions 
      });

      // Check if manual override occurred - if selections no longer match active strategies, remove them
      // checkAndRemoveMismatchedGoals will update storage if goals are removed
      const hadMismatches = checkAndRemoveMismatchedGoals(operators, newStorage);
      
      // Only set storage if no mismatches were found (otherwise checkAndRemoveMismatchedGoals already set it)
      if (!hadMismatches) {
        setStorage(newStorage);
      }
    } else {
      // Unchecking - check if this storage is required by any active goal
      if (storageItem.appliedBy.length > 0) {
        // Show warning
        setUncheckedRequiredItems(prev => new Set([...Array.from(prev), storageId]));
      } else {
        setUncheckedRequiredItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(storageId);
          return newSet;
        });
      }
      const newStorage = storage.map(s => 
        s.id === storageId ? { ...s, isSelected: false } : s
      );
      
      // Update selectedStorage in wizard data
      const newSelectedStorage = newStorage
        .filter(s => s.isSelected)
        .map(s => s.id);
      
      // Build version map for selected storage
      const storageVersions: { [key: string]: { version: string; channel: string } } = {};
      newStorage
        .filter(s => s.isSelected && s.version && s.channel)
        .forEach(s => {
          storageVersions[s.id] = { version: s.version!, channel: s.channel! };
        });
      
      onDataChange({ 
        selectedStorage: newSelectedStorage,
        storageVersions 
      });

      // Check if manual override occurred - if selections no longer match active strategies, remove them
      // checkAndRemoveMismatchedGoals will update storage if goals are removed
      const hadMismatches = checkAndRemoveMismatchedGoals(operators, newStorage);
      
      // Only set storage if no mismatches were found (otherwise checkAndRemoveMismatchedGoals already set it)
      if (!hadMismatches) {
        setStorage(newStorage);
      }
    }
  };

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
    onDataChange({ selectedPersona: personaId });
  };

  const handleCapabilityChange = (capabilityId: string, checked: boolean) => {
    // Prevent unchecking required capabilities
    const capability = capabilities.find(c => c.id === capabilityId);
    if (!checked && capability?.required) {
      return; // Don't allow unchecking required capabilities
    }

    // Check if this capability is required by any active goal
    const operator = operators.find(op => op.id === capabilityId);
    if (!checked && operator && operator.appliedBy.length > 0) {
      // Show warning
      setUncheckedRequiredItems(prev => new Set([...Array.from(prev), capabilityId]));
    } else {
      setUncheckedRequiredItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(capabilityId);
        return newSet;
      });
    }

    // Update operator state to sync with capabilities
    const newOperators = operators.map(op => 
      op.id === capabilityId ? { ...op, isSelected: checked } : op
    );
    setOperators(newOperators);
    
    let newCapabilities: string[];
    
    if (checked) {
      newCapabilities = [...selectedCapabilities, capabilityId];
      
      // Auto-select UI plugins when their dependencies are checked
      const pluginsToAdd: string[] = [];
      
      if (capabilityId === 'loki' && !selectedUIPlugins.includes('logging-ui')) {
        pluginsToAdd.push('logging-ui');
      }
      if (capabilityId === 'tempo' && !selectedUIPlugins.includes('tracing-ui')) {
        pluginsToAdd.push('tracing-ui');
      }
      if (capabilityId === 'korrel8r' && !selectedUIPlugins.includes('troubleshooting-panel')) {
        pluginsToAdd.push('troubleshooting-panel');
      }
      if (capabilityId === 'network-traffic' && !selectedUIPlugins.includes('network-ui')) {
        pluginsToAdd.push('network-ui');
      }
      
      if (pluginsToAdd.length > 0) {
        const newPlugins = [...selectedUIPlugins, ...pluginsToAdd];
        setSelectedUIPlugins(newPlugins);
        onDataChange({ selectedUIPlugins: newPlugins });
      }
    } else {
      newCapabilities = selectedCapabilities.filter(id => id !== capabilityId);
      // Remove nested options when parent is unchecked
      if (selectedNestedOptions[capabilityId]) {
        const newNestedOptions = { ...selectedNestedOptions };
        delete newNestedOptions[capabilityId];
        setSelectedNestedOptions(newNestedOptions);
        onDataChange({ selectedNestedOptions: newNestedOptions });
      }
      
      // Remove UI plugins when their dependencies are unchecked
      const pluginsToRemove: string[] = [];
      
      if (capabilityId === 'metrics-alerting') {
        pluginsToRemove.push('monitoring-ui', 'perses');
      }
      if (capabilityId === 'loki') {
        pluginsToRemove.push('logging-ui');
        // Only remove incident-detection-ui if not required by active goals
        const hasIncidentResponse = activeGoals.includes('incident-response');
        if (!hasIncidentResponse) {
          pluginsToRemove.push('incident-detection-ui');
        }
      }
      if (capabilityId === 'tempo') {
        pluginsToRemove.push('tracing-ui');
      }
      if (capabilityId === 'korrel8r') {
        pluginsToRemove.push('troubleshooting-panel');
      }
      if (capabilityId === 'network-traffic') {
        pluginsToRemove.push('network-ui');
      }
      
      if (pluginsToRemove.length > 0) {
        const newPlugins = selectedUIPlugins.filter(pluginId => !pluginsToRemove.includes(pluginId));
        setSelectedUIPlugins(newPlugins);
        onDataChange({ selectedUIPlugins: newPlugins });
      }
    }
    
    setSelectedCapabilities(newCapabilities);
    onDataChange({ selectedCapabilities: newCapabilities });
  };

  const handleNestedOptionChange = (capabilityId: string, optionId: string, checked: boolean) => {
    const currentOptions = selectedNestedOptions[capabilityId] || [];
    let newOptions: string[];
    
    if (checked) {
      newOptions = [...currentOptions, optionId];
    } else {
      newOptions = currentOptions.filter(id => id !== optionId);
    }
    
    const newNestedOptions = { ...selectedNestedOptions, [capabilityId]: newOptions };
    setSelectedNestedOptions(newNestedOptions);
    onDataChange({ selectedNestedOptions: newNestedOptions });
  };

  const checkDependencies = (capability: Capability): { satisfied: boolean; missing: string[] } => {
    if (!capability.dependencies || capability.dependencies.length === 0) {
      return { satisfied: true, missing: [] };
    }
    
    const missing = capability.dependencies.filter(dep => !selectedCapabilities.includes(dep));
    return { satisfied: missing.length === 0, missing };
  };

  // Auto-enable/disable UI plugins based on dependencies
  const availablePlugins = useMemo(() => {
    return uiPlugins.filter(plugin => {
      if (!plugin.dependencies || plugin.dependencies.length === 0) {
        return true;
      }
      return plugin.dependencies.some(dep => selectedCapabilities.includes(dep));
    });
  }, [selectedCapabilities]);

  const handleAdvancedModeChange = (checked: boolean) => {
    setAdvancedMode(checked);
    onDataChange({ advancedMode: checked });
    
    // When advanced mode is disabled, clear all selections
    if (!checked) {
      setSelectedUIPlugins([]);
      onDataChange({ selectedUIPlugins: [] });
    }
  };

  const handleUIPluginChange = (pluginId: string, checked: boolean) => {
    let newPlugins: string[];
    
    if (checked) {
      newPlugins = [...selectedUIPlugins, pluginId];
    } else {
      newPlugins = selectedUIPlugins.filter(id => id !== pluginId);
    }
    
    setSelectedUIPlugins(newPlugins);
    onDataChange({ selectedUIPlugins: newPlugins });
  };

  return (
    <div style={{ maxWidth: '800px', marginTop: '24px', marginLeft: '24px' }}>
      <Stack hasGutter>
        {/* Form Title */}
        <StackItem>
          <Title headingLevel="h2" size="2xl" style={{ fontSize: '24px', marginBottom: '24px' }}>
            Components and configuration
          </Title>
        </StackItem>
        
        {/* Goals Selection Section (Checkboxes) */}
        <StackItem>
          <Title headingLevel="h2" size="lg" style={{ marginBottom: '8px' }}>
            Choose your Observability strategy
          </Title>
          <Content style={{ marginBottom: '24px', color: '#6a6e73' }}>
            Select one or more operational focuses to pre-configure the recommended stack. You can customize specific components later.
          </Content>
          
          <Grid hasGutter>
            {goals.map((goal) => (
              <GridItem key={goal.id} span={4}>
                <div
                  style={{
                    minHeight: '120px',
                    border: activeGoals.includes(goal.id) ? '2px solid #0066cc' : '1px solid #d2d2d2',
                    borderRadius: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* 8px vertical bar inside card, so it sits inside the selection border when selected */}
                  <div
                    role="presentation"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 8,
                      backgroundColor: STRATEGY_CARD_COLORS[goal.id as GoalID],
                      pointerEvents: 'none',
                    }}
                  />
                  <div style={{ position: 'relative', padding: '24px', paddingLeft: '32px' }}>
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Checkbox
                          id={`goal-${goal.id}`}
                          label={<span style={{ fontWeight: '600', fontSize: '14px' }}>{goal.name}</span>}
                          isChecked={activeGoals.includes(goal.id)}
                          onChange={(_, checked) => handleGoalChange(goal.id, checked)}
                        />
                      </FlexItem>
                      <FlexItem>
                        <Content style={{ fontSize: '14px', color: '#6a6e73' }}>
                          {goal.description}
                        </Content>
                      </FlexItem>
                      {overriddenGoals.has(goal.id) && !activeGoals.includes(goal.id) && (
                        <FlexItem>
                          <Content style={{ fontSize: '12px', color: '#c9190b', fontStyle: 'italic', marginTop: '4px' }}>
                            Selection modified: Configuration is now custom.
                          </Content>
                        </FlexItem>
                      )}
                    </Flex>
                  </div>
                </div>
              </GridItem>
            ))}
          </Grid>
        </StackItem>

        {/* Intelligent Preselection Alert */}
        {activeGoals.length > 0 && !isPreselectionAlertDismissed && (
          <StackItem>
            <Alert
              variant={AlertVariant.info}
              isInline
              title="Recommended configuration applied"
              actionClose={
                <AlertActionCloseButton onClose={() => setIsPreselectionAlertDismissed(true)} />
              }
            >
              Your strategy has pre-configured the observability stack. You can add or remove components to fit your cluster requirements.
            </Alert>
          </StackItem>
        )}

        {/* Observability Services (left) and Console experience (right) */}
        <StackItem>
          <Title headingLevel="h2" size="lg" style={{ marginTop: 'var(--pf-t--global--spacer--md)', marginBottom: '8px' }}>
            Observability Services
          </Title>
          <Content style={{ marginBottom: '24px', color: '#6a6e73' }}>
            Select operators and storage for your observability stack, and UI plugins to enhance your console experience.
          </Content>

          <Grid hasGutter>
            <GridItem md={6}>
              <Card>
                <CardBody>
                  <Stack hasGutter>
                    {/* Operators */}
                  <StackItem>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                      Capabilities (operators)
                    </Title>
                    <Stack hasGutter>
                      {operators.map((operator) => {
                          const goalNames = operator.appliedBy.map(goalId => {
                            const goal = goals.find(g => g.id === goalId);
                            return goal?.name || goalId;
                          });
                          
                          // Check for high-demand storage requirements
                          const capability = capabilities.find(c => c.id === operator.id);
                          const hasLVM = storage.find(s => s.id === 'lvm')?.isSelected;
                          const hasODF = storage.find(s => s.id === 'odf')?.isSelected;
                          const showHighDemandWarning = operator.id === 'network-traffic' && 
                                                         operator.isSelected && 
                                                         capability?.requiresHighPerformanceStorage;
                          
                          return (
                            <StackItem key={operator.id}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Checkbox
                                    id={`operator-${operator.id}`}
                                    label={
                                      <span style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {operator.name}
                                        {operator.isLocked && (
                                          <span style={{ color: '#c9190b', marginLeft: '4px' }}>*</span>
                                        )}
                                      </span>
                                    }
                                    isChecked={operator.isSelected}
                                    isDisabled={operator.isLocked}
                                    onChange={(_, checked) => handleOperatorChange(operator.id, checked)}
                                  />
                                </FlexItem>
                                {operator.appliedBy.length > 0 && (
                                  <FlexItem>
                                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                                      {operator.appliedBy.map((goalId, index) => {
                                        const goal = goals.find(g => g.id === goalId);
                                        const goalName = goal?.name || goalId;
                                        return (
                                          <FlexItem key={index}>
                                            <Label color={STRATEGY_LABEL_COLOR[goalId as GoalID]} variant="outline">
                                              {goalName}
                                            </Label>
                                          </FlexItem>
                                        );
                                      })}
                                    </Flex>
                                  </FlexItem>
                                )}
                              </Flex>
                              {operator.description && (
                                <Content style={{ marginLeft: '24px', marginTop: '4px', fontSize: '14px', color: '#6a6e73' }}>
                                  {operator.description}
                                </Content>
                              )}
                              
                              {/* Version and Channel Display */}
                              {operator.isSelected && operator.version && operator.channel && (
                                <div style={{ marginLeft: '24px', marginTop: '8px' }}>
                                  {operator.isUpdating ? (
                                    <Spinner size="sm" style={{ width: '10px', height: '10px' }} />
                                  ) : (
                                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                      <FlexItem>
                                        <Badge isRead style={{ fontSize: '12px' }}>
                                          v{operator.version}
                                        </Badge>
                                      </FlexItem>
                                      <FlexItem>
                                        <HelperText>
                                          <HelperTextItem variant="default" style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                                            Update channel: {operator.channel}
                                          </HelperTextItem>
                                        </HelperText>
                                      </FlexItem>
                                    </Flex>
                                  )}
                                </div>
                              )}
                              
                              {/* Nested Options for Loki */}
                              {operator.id === 'loki' && operator.isSelected && (
                                <div style={{ marginLeft: '24px', marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid #d2d2d2' }}>
                                  <Stack hasGutter>
                                    <StackItem>
                                      <Checkbox
                                        id="option-infrastructure-logs"
                                        label={
                                          <span style={{ fontSize: '14px' }}>
                                            Infrastructure logs
                                          </span>
                                        }
                                        isChecked={(selectedNestedOptions['loki'] || []).includes('infrastructure-logs')}
                                        onChange={(_, checked) =>
                                          handleNestedOptionChange('loki', 'infrastructure-logs', checked)
                                        }
                                      />
                                      <Content style={{ marginLeft: '24px', marginTop: '4px', fontSize: '14px', color: '#6a6e73' }}>
                                        Node, API server, and control plane logs.
                                      </Content>
                                    </StackItem>
                                    <StackItem>
                                      <Checkbox
                                        id="option-application-logs"
                                        label={
                                          <span style={{ fontSize: '14px' }}>
                                            Application logs
                                          </span>
                                        }
                                        isChecked={(selectedNestedOptions['loki'] || []).includes('application-logs')}
                                        onChange={(_, checked) =>
                                          handleNestedOptionChange('loki', 'application-logs', checked)
                                        }
                                      />
                                      <Content style={{ marginLeft: '24px', marginTop: '4px', fontSize: '14px', color: '#6a6e73' }}>
                                        Container stdout/stderr from workloads.
                                      </Content>
                                    </StackItem>
                                  </Stack>
                                </div>
                              )}
                              
                              {/* Nested Options for OpenTelemetry */}
                              {operator.id === 'opentelemetry' && operator.isSelected && (
                                <div style={{ marginLeft: '24px', marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid #d2d2d2' }}>
                                  <Stack hasGutter>
                                    <StackItem>
                                      <Checkbox
                                        id="option-auto-instrumentation"
                                        label={
                                          <span style={{ fontSize: '14px' }}>
                                            Enable Auto-Instrumentation
                                          </span>
                                        }
                                        isChecked={(selectedNestedOptions['opentelemetry'] || []).includes('auto-instrumentation')}
                                        onChange={(_, checked) =>
                                          handleNestedOptionChange('opentelemetry', 'auto-instrumentation', checked)
                                        }
                                      />
                                    </StackItem>
                                  </Stack>
                                </div>
                              )}
                              
                              {uncheckedRequiredItems.has(operator.id) && (
                                <Alert
                                  variant={AlertVariant.warning}
                                  isInline
                                  title="This operator is required by selected goals"
                                  style={{ marginTop: '8px', marginLeft: '24px' }}
                                >
                                  Unchecking this operator may impact the functionality of: {goalNames.join(', ')}. Consider keeping it enabled.
                                </Alert>
                              )}
                              
                              {/* High-Demand Storage Warning for Network Traffic Analysis */}
                              {showHighDemandWarning && hasLVM && (
                                <Alert
                                  variant={AlertVariant.warning}
                                  isInline
                                  title="High storage demand detected"
                                  style={{ marginTop: '8px', marginLeft: '24px' }}
                                >
                                  Network Traffic Analysis generates high volumes of data. LVM storage may experience performance issues or rapid disk exhaustion. OpenShift Data Foundation (ODF) is recommended for this capability.
                                </Alert>
                              )}
                              
                              {showHighDemandWarning && hasODF && (
                                <Alert
                                  variant={AlertVariant.info}
                                  isInline
                                  title="Storage optimization"
                                  style={{ marginTop: '8px', marginLeft: '24px' }}
                                >
                                  You have selected ODF, which is optimized for the high-throughput requirements of Network Traffic Analysis.
                                </Alert>
                              )}
                            </StackItem>
                          );
                        })}
                    </Stack>
                  </StackItem>

                  <Divider />

                  {/* Storage */}
                  <StackItem>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                      Storage (operators)
                    </Title>
                    <Stack hasGutter>
                      {storage.map((storageItem) => {
                          const goalNames = storageItem.appliedBy.map(goalId => {
                            const goal = goals.find(g => g.id === goalId);
                            return goal?.name || goalId;
                          });
                          
                          return (
                            <StackItem key={storageItem.id}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Radio
                                    id={`storage-${storageItem.id}`}
                                    name="storage-selection"
                                    label={<span style={{ fontWeight: '600', fontSize: '14px' }}>{storageItem.name}</span>}
                                    isChecked={storageItem.isSelected}
                                    onChange={() => handleStorageChange(storageItem.id, true)}
                                  />
                                </FlexItem>
                                {storageItem.appliedBy.length > 0 && (
                                  <FlexItem>
                                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                                      {storageItem.appliedBy.map((goalId, index) => {
                                        const goal = goals.find(g => g.id === goalId);
                                        const goalName = goal?.name || goalId;
                                        return (
                                          <FlexItem key={index}>
                                            <Label color={STRATEGY_LABEL_COLOR[goalId as GoalID]} variant="outline">
                                              {goalName}
                                            </Label>
                                          </FlexItem>
                                        );
                                      })}
                                    </Flex>
                                  </FlexItem>
                                )}
                              </Flex>
                              {storageItem.description && (
                                <Content style={{ marginLeft: '24px', marginTop: '4px', fontSize: '14px', color: '#6a6e73' }}>
                                  {storageItem.description}
                                </Content>
                              )}
                              
                              {/* Version and Channel Display */}
                              {storageItem.isSelected && storageItem.version && storageItem.channel && (
                                <div style={{ marginLeft: '24px', marginTop: '8px' }}>
                                  {storageItem.isUpdating ? (
                                    <Spinner size="sm" style={{ width: '10px', height: '10px' }} />
                                  ) : (
                                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                      <FlexItem>
                                        <Badge isRead style={{ fontSize: '12px' }}>
                                          v{storageItem.version}
                                        </Badge>
                                      </FlexItem>
                                      <FlexItem>
                                        <HelperText>
                                          <HelperTextItem variant="default" style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                                            Update channel: {storageItem.channel}
                                          </HelperTextItem>
                                        </HelperText>
                                      </FlexItem>
                                    </Flex>
                                  )}
                                </div>
                              )}
                              {uncheckedRequiredItems.has(storageItem.id) && (
                                storageItem.id === 'odf' && selectedCapabilities.includes('thanos') ? (
                                  <Alert
                                    variant={AlertVariant.warning}
                                    isInline
                                    title="Storage requirement conflict"
                                    style={{ marginTop: '8px', marginLeft: '24px' }}
                                  >
                                    OpenShift Data Foundation is required to support Long-term Storage (Thanos). Deselecting it will prevent the storage of historical metrics.
                                  </Alert>
                                ) : (
                                  <Alert
                                    variant={AlertVariant.warning}
                                    isInline
                                    title="This storage is required by selected goals"
                                    style={{ marginTop: '8px', marginLeft: '24px' }}
                                  >
                                    Unchecking this storage may impact the functionality of: {goalNames.join(', ')}. Consider keeping it enabled.
                                  </Alert>
                                )
                              )}
                            </StackItem>
                          );
                        })}
                    </Stack>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
            </GridItem>

            <GridItem md={6}>
              <Card>
                <CardHeader
                  actions={{
                    actions: (
                      <Switch
                        id="advanced-mode"
                        label="Advanced Mode"
                        isChecked={advancedMode}
                        onChange={(_, checked) => handleAdvancedModeChange(checked)}
                      />
                    ),
                    hasNoOffset: false,
                  }}
                >
                  <CardTitle>Console experience (UI Plugins and components)</CardTitle>
                </CardHeader>
                <CardBody>
                  <Stack hasGutter>
                {availablePlugins.map((plugin) => {
                  const isChecked = selectedUIPlugins.includes(plugin.id);
                  
                  // Determine which goals require this plugin based on dependencies and goal-specific rules
                  const requiredByGoals: string[] = [];
                  
                  // Check if plugin dependencies are satisfied and which goals require those dependencies
                  if (plugin.dependencies && plugin.dependencies.length > 0) {
                    activeGoals.forEach(goalId => {
                      const deps = NEED_DEPENDENCIES[goalId as GoalID];
                      if (deps) {
                        // Check if all plugin dependencies are required by this goal
                        const allDepsSatisfied = plugin.dependencies!.every(dep => 
                          deps.operators.includes(dep) || selectedCapabilities.includes(dep)
                        );
                        if (allDepsSatisfied) {
                          requiredByGoals.push(goalId);
                        }
                      }
                    });
                  }
                  
                  // Goal-specific plugin rules
                  if (plugin.id === 'perses') {
                    // Perses is specifically required by Platform Governance and Incident Response
                    if (activeGoals.includes('platform-governance') && selectedCapabilities.includes('metrics-alerting')) {
                      if (!requiredByGoals.includes('platform-governance')) {
                        requiredByGoals.push('platform-governance');
                      }
                    }
                    if (activeGoals.includes('incident-response') && selectedCapabilities.includes('metrics-alerting')) {
                      if (!requiredByGoals.includes('incident-response')) {
                        requiredByGoals.push('incident-response');
                      }
                    }
                  }
                  
                  if (plugin.id === 'incident-detection-ui') {
                    // Incident Detection UI is specifically required by Incident Response
                    if (activeGoals.includes('incident-response') && selectedCapabilities.includes('loki')) {
                      if (!requiredByGoals.includes('incident-response')) {
                        requiredByGoals.push('incident-response');
                      }
                    }
                  }
                  
                  // Remove duplicates
                  const uniqueGoalIds = Array.from(new Set(requiredByGoals));
                  const goalNames = uniqueGoalIds.map(goalId => {
                    const goal = goals.find(g => g.id === goalId);
                    return goal?.name || goalId;
                  });

                  return (
                    <StackItem key={plugin.id}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Checkbox
                            id={`plugin-${plugin.id}`}
                            label={<span style={{ fontWeight: '600', fontSize: '14px' }}>{plugin.name}</span>}
                            isChecked={isChecked}
                            isDisabled={!advancedMode}
                            onChange={(_, checked) => handleUIPluginChange(plugin.id, checked)}
                          />
                        </FlexItem>
                        {goalNames.length > 0 && (
                          <FlexItem>
                            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                              {uniqueGoalIds.map((goalId, index) => {
                                const goal = goals.find(g => g.id === goalId);
                                const goalName = goal?.name || goalId;
                                return (
                                  <FlexItem key={index}>
                                    <Label color={STRATEGY_LABEL_COLOR[goalId as GoalID]} variant="outline">
                                      {goalName}
                                    </Label>
                                  </FlexItem>
                                );
                              })}
                            </Flex>
                          </FlexItem>
                        )}
                      </Flex>
                      <Content style={{ marginLeft: '24px', marginTop: '4px', fontSize: '14px', color: '#6a6e73' }}>
                        {plugin.description}
                      </Content>
                    </StackItem>
                  );
                })}
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </StackItem>
      </Stack>
    </div>
  );
};
