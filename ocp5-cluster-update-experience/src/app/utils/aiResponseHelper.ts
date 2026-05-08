// AI Response Helper - Context-aware natural language processing for OpenShift LightSpeed

import { getDerivedSupportPhase } from "@/lib/operatorSupportLifecycle";

interface AIResponse {
  content: string;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

interface PageContext {
  pathname: string;
  operators?: any[];
  selectedOperators?: string[];
}

// Extract intent from user input using NLP-like pattern matching
export function extractIntent(userInput: string): {
  primaryIntent: string;
  entities: string[];
  confidence: number;
} {
  const lowerInput = userInput.toLowerCase();
  
  // Operator-related intents
  if (
    /update|upgrade|patch|install/.test(lowerInput) && 
    /operator|software/.test(lowerInput)
  ) {
    return {
      primaryIntent: 'operator_update',
      entities: extractEntities(userInput, ['operator', 'version']),
      confidence: 0.9
    };
  }
  
  if (
    /list|show|display|view|what/.test(lowerInput) && 
    /operator|software|install/.test(lowerInput)
  ) {
    return {
      primaryIntent: 'operator_list',
      entities: extractEntities(userInput, ['status', 'filter']),
      confidence: 0.85
    };
  }
  
  if (/compatibility|compatible|support/.test(lowerInput) && /operator/.test(lowerInput)) {
    return {
      primaryIntent: 'operator_compatibility',
      entities: extractEntities(userInput, ['operator', 'version']),
      confidence: 0.9
    };
  }
  
  // Cluster update intents
  if (
    /update|upgrade|patch/.test(lowerInput) && 
    /cluster|openshift/.test(lowerInput)
  ) {
    return {
      primaryIntent: 'cluster_update',
      entities: extractEntities(userInput, ['version']),
      confidence: 0.9
    };
  }
  
  if (/pre-check|check|validate|ready/.test(lowerInput)) {
    return {
      primaryIntent: 'pre_check',
      entities: [],
      confidence: 0.85
    };
  }
  
  // Health and status intents
  if (/health|status|how.*doing|state/.test(lowerInput)) {
    return {
      primaryIntent: 'health_status',
      entities: extractEntities(userInput, ['component']),
      confidence: 0.8
    };
  }
  
  // Help and information
  if (/help|how to|guide|explain|what is/.test(lowerInput)) {
    return {
      primaryIntent: 'help',
      entities: extractEntities(userInput, ['topic']),
      confidence: 0.75
    };
  }
  
  // Troubleshooting
  if (/error|fail|issue|problem|fix|troubleshoot|debug/.test(lowerInput)) {
    return {
      primaryIntent: 'troubleshoot',
      entities: extractEntities(userInput, ['error', 'component']),
      confidence: 0.85
    };
  }
  
  return {
    primaryIntent: 'general_query',
    entities: [],
    confidence: 0.5
  };
}

function extractEntities(input: string, entityTypes: string[]): string[] {
  const entities: string[] = [];
  const lowerInput = input.toLowerCase();
  
  // Extract version numbers
  if (entityTypes.includes('version')) {
    const versionMatch = input.match(/\d+\.\d+(\.\d+)?/);
    if (versionMatch) entities.push(`version:${versionMatch[0]}`);
  }
  
  // Extract operator names
  if (entityTypes.includes('operator')) {
    const operatorPatterns = [
      'abot', 'airflow', 'ansible', 'bare metal', 'camel k',
      'gitops', 'service mesh', 'automation platform'
    ];
    operatorPatterns.forEach(op => {
      if (lowerInput.includes(op)) {
        entities.push(`operator:${op}`);
      }
    });
  }
  
  // Extract status filters
  if (entityTypes.includes('status')) {
    if (/available|pending|need.*update/.test(lowerInput)) {
      entities.push('status:updates-available');
    }
    if (/installed|active/.test(lowerInput)) {
      entities.push('status:installed');
    }
    if (/failed|error/.test(lowerInput)) {
      entities.push('status:failed');
    }
  }
  
  return entities;
}

// Generate context-aware responses based on current page
export function getContextAwareResponse(
  userInput: string,
  pageContext: PageContext,
  navigate?: (path: string) => void
): AIResponse {
  const intent = extractIntent(userInput);
  const { pathname, operators, selectedOperators } = pageContext;
  
  // INSTALLED SOFTWARE / OPERATORS PAGE
  if (pathname.includes('/installed-operators') || pathname.includes('/installed-software')) {
    return getInstalledOperatorsResponse(userInput, intent, operators, selectedOperators, navigate);
  }
  
  // SOFTWARE CATALOG PAGE
  if (pathname.includes('/software-catalog')) {
    return getSoftwareCatalogResponse(userInput, intent, navigate);
  }
  
  // CLUSTER UPDATE PAGE
  if (pathname.includes('/cluster-update')) {
    return getClusterUpdateResponse(userInput, intent, pathname, navigate);
  }
  
  // HOME PAGE
  if (pathname === '/' || pathname.includes('/home')) {
    return getHomePageResponse(userInput, intent, navigate);
  }
  
  // WORKLOADS PAGE
  if (pathname.includes('/workloads')) {
    return getWorkloadsResponse(userInput, intent, navigate);
  }
  
  // NETWORKING PAGE
  if (pathname.includes('/networking')) {
    return getNetworkingResponse(userInput, intent, navigate);
  }
  
  // STORAGE PAGE
  if (pathname.includes('/storage')) {
    return getStorageResponse(userInput, intent, navigate);
  }
  
  // OBSERVE PAGE
  if (pathname.includes('/observe')) {
    return getObserveResponse(userInput, intent, navigate);
  }
  
  // Default fallback
  return getGeneralResponse(userInput, intent, navigate);
}

// ===== PAGE-SPECIFIC RESPONSE HANDLERS =====

function getInstalledOperatorsResponse(
  userInput: string,
  intent: any,
  operators: any[] = [],
  selectedOperators: string[] = [],
  navigate?: (path: string) => void
): AIResponse {
  const lowerInput = userInput.toLowerCase();
  
  // List operators
  if (intent.primaryIntent === 'operator_list' || /show|list|what|which/.test(lowerInput)) {
    const updatesAvailable = operators.filter(op => op.newVersion).length;
    const requiredUpdates = operators.filter(op => op.required).length;
    
    return {
      content: `📦 **Installed Software Overview:**\n\n**Total Installed:** ${operators.length} operators\n**Updates Available:** ${updatesAvailable} operators\n**Required Updates:** ${requiredUpdates} operators\n\n**Operators with Updates:**\n${operators
        .filter(op => op.newVersion)
        .map(op => `${op.required ? '⚠️' : '•'} **${op.name}** ${op.version} → ${op.newVersion} ${op.required ? '(Required)' : ''}`)
        .join('\n')}\n\n${requiredUpdates > 0 ? '⚠️ Some operators must be updated before cluster update to OpenShift 5.0.16.' : ''}`,
      suggestions: updatesAvailable > 0 ? [
        'Update all operators',
        `Update required operators`,
        'Which operators are required?',
        'Show compatibility status'
      ] : [
        'Check for new updates',
        'View operator details'
      ]
    };
  }
  
  // Update operators
  if (intent.primaryIntent === 'operator_update' || /update|upgrade/.test(lowerInput)) {
    if (/all/.test(lowerInput)) {
      const updatesAvailable = operators.filter(op => op.newVersion).length;
      return {
        content: `🔄 **Updating ${updatesAvailable} Operators**\n\nI'll update all operators with available updates:\n${operators
          .filter(op => op.newVersion)
          .map(op => `• ${op.name} (${op.version} → ${op.newVersion})`)
          .join('\n')}\n\n**Process:**\n1. AI compatibility analysis\n2. Determine update order\n3. Rolling updates (zero downtime)\n4. Health validation\n\nWould you like me to proceed?`,
        suggestions: [
          'Yes, update all operators',
          'Only update required operators',
          'Show me detailed update plan',
          'What are the risks?'
        ]
      };
    }
    
    if (/required/.test(lowerInput)) {
      const requiredOps = operators.filter(op => op.required && op.newVersion);
      return {
        content: `⚠️ **Required Operator Updates**\n\nThese operators must be updated for OpenShift 5.0.16 compatibility:\n\n${requiredOps
          .map(op => `• **${op.name}**\n  Current: ${op.version} → New: ${op.newVersion}`)
          .join('\n\n')}\n\nI can run AI analysis and update these for you.`,
        suggestions: [
          'Update required operators now',
          'Analyze update impact',
          'Show compatibility details'
        ]
      };
    }
    
    // Specific operator update
    const operatorName = intent.entities.find((e: string) => e.startsWith('operator:'));
    if (operatorName) {
      const op = operators.find(o => 
        o.name.toLowerCase().includes(operatorName.split(':')[1])
      );
      
      if (op) {
        return {
          content: `🔧 **${op.name} Update**\n\nCurrent: ${op.version}\nAvailable: ${op.newVersion || 'Up to date'}\n${op.required ? '\n⚠️ This update is **required** for cluster update.' : ''}\n\nShall I proceed with the update?`,
          suggestions: op.newVersion ? [
            `Update ${op.name}`,
            'Analyze compatibility first',
            'Show release notes'
          ] : [
            'Check for updates',
            'View operator details'
          ]
        };
      }
    }
  }
  
  // Compatibility check
  if (intent.primaryIntent === 'operator_compatibility' || /compatible|compatibility/.test(lowerInput)) {
    const incompatible = operators.filter(
      (op) =>
        op.clusterCompatibility === "Incompatible" || getDerivedSupportPhase(op) === "End of life"
    );
    
    return {
      content: `🔍 **Operator Compatibility Analysis**\n\n**OpenShift 5.0.16 Compatibility:**\n${operators
        .map(op => {
          if (op.required && op.newVersion) return `⚠️ ${op.name} - **Requires update**`;
          if (op.clusterCompatibility === 'Compatible') return `✅ ${op.name} - Compatible`;
          return `❌ ${op.name} - Needs attention`;
        })
        .join('\n')}\n\n${incompatible.length > 0 ? `⚠️ ${incompatible.length} operators need attention before cluster update.` : '✅ All operators are compatible!'}`,
      suggestions: [
        'Update incompatible operators',
        'Show update recommendations',
        'View detailed compatibility report'
      ]
    };
  }
  
  // Help with operators
  if (intent.primaryIntent === 'help' || /how to|help|guide/.test(lowerInput)) {
    return {
      content: `💡 **Operator Management Help**\n\n**What I can help you with:**\n\n📋 **View & Monitor:**\n• List all installed operators\n• Check update availability\n• Monitor operator health\n\n🔄 **Updates:**\n• Update single or multiple operators\n• AI-assisted bulk updates\n• Compatibility analysis\n\n⚙️ **Management:**\n• Change update plans (Manual/Automatic)\n• View operator details\n• Uninstall operators\n\n**Common Questions:**\n• "Which operators need updates?"\n• "Update all operators"\n• "Check operator compatibility"\n• "Show operator details for [name]"`,
      suggestions: [
        'Which operators need updates?',
        'Update all operators',
        'Check compatibility',
        'Browse Software Catalog'
      ]
    };
  }
  
  // Selected operators context
  if (selectedOperators && selectedOperators.length > 0) {
    if (/selected|choose|pick/.test(lowerInput)) {
      return {
        content: `📌 **You have ${selectedOperators.length} operator(s) selected:**\n\n${selectedOperators.map(name => `• ${name}`).join('\n')}\n\nI can help you update these operators together with AI-powered analysis.`,
        suggestions: [
          'Update selected operators',
          'Deselect all',
          'Analyze compatibility'
        ]
      };
    }
  }
  
  // Default operator page response
  return {
    content: `I can help you manage your installed software and operators. You can ask me about:\n\n• Listing installed operators\n• Checking for updates\n• Updating operators\n• Compatibility status\n• Operator details\n\nWhat would you like to know?`,
    suggestions: [
      'List all operators',
      'Which operators need updates?',
      'Update all operators',
      'Check compatibility'
    ]
  };
}

function getSoftwareCatalogResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  const lowerInput = userInput.toLowerCase();
  
  if (/search|find|look for/.test(lowerInput)) {
    return {
      content: `🔍 **Software Catalog Search**\n\nI can help you find operators! Try:\n\n• "Find database operators"\n• "Show Red Hat operators"\n• "Search for monitoring tools"\n• "List AI/ML operators"\n\nWhat are you looking for?`,
      suggestions: [
        'Show database operators',
        'Find Red Hat operators',
        'Show AI/ML operators',
        'List monitoring tools'
      ]
    };
  }
  
  if (/install/.test(lowerInput)) {
    return {
      content: `📦 **Installing Software**\n\nTo install an operator:\n\n1. **Search** - Find the operator you need\n2. **Review** - Check compatibility and requirements\n3. **Configure** - Select installation options\n4. **Install** - I'll guide you through the process\n\nWhich operator would you like to install?`,
      suggestions: [
        'Show popular operators',
        'Browse by category',
        'View recently updated'
      ]
    };
  }
  
  return {
    content: `📚 **Software Catalog**\n\nI can help you:\n• Browse available operators\n• Search by name or category\n• Install new software\n• Check operator details\n• Filter by provider (Red Hat, Community, etc.)\n\nWhat would you like to explore?`,
    suggestions: [
      'Show all operators',
      'Find specific operator',
      'View Red Hat operators',
      'Show installed software'
    ]
  };
}

function getClusterUpdateResponse(
  userInput: string,
  intent: any,
  pathname: string,
  navigate?: (path: string) => void
): AIResponse {
  const lowerInput = userInput.toLowerCase();
  
  if (pathname.includes('/preflight')) {
    if (/result|status|pass|fail/.test(lowerInput)) {
      return {
        content: `🔍 **Pre-check Status**\n\nPre-checks validate your cluster is ready for update. They check:\n\n✅ **Infrastructure:**\n• Node health and capacity\n• Resource availability\n• Network connectivity\n\n✅ **Software:**\n• Operator compatibility\n• API migrations\n• Deprecated features\n\n✅ **Configuration:**\n• RBAC permissions\n• Storage classes\n• Custom resources\n\nWould you like me to run the checks?`,
        suggestions: [
          'Assess readiness',
          'Explain check failures',
          'Show remediation steps'
        ]
      };
    }
  }
  
  if (/when|how long|time|duration/.test(lowerInput)) {
    return {
      content: `⏱️ **Update Timeline**\n\n**Estimated Duration:** 2-3 hours\n\n**Breakdown:**\n• **Pre-checks:** 5-10 minutes\n• **Control plane update:** 45-60 minutes\n• **Worker node update:** 60-90 minutes\n• **Validation:** 15-20 minutes\n\n**Downtime:** Minimal! Your workloads stay running during rolling updates.\n\n**Best Time:** Schedule during low-traffic periods for peace of mind.`,
      suggestions: [
        'Start update now',
        'Schedule for later',
        'What happens during update?'
      ]
    };
  }
  
  if (/cancel|stop|abort/.test(lowerInput)) {
    return {
      content: `⚠️ **About Canceling Updates**\n\nOpenShift updates use a rolling strategy and are designed to be safe:\n\n**Can I cancel?**\n• ✅ Before starting: Yes, anytime\n• ⚠️ During pre-check: Yes, safely\n• ❌ During update: Not recommended\n\n**Why not cancel mid-update?**\n• Cluster could be in inconsistent state\n• Some nodes updated, others not\n• May require manual recovery\n\n**Alternative:** Let the update complete, then rollback if needed.`,
      suggestions: [
        'Tell me about rollbacks',
        'What if something goes wrong?',
        'Pause operator updates'
      ]
    };
  }
  
  return {
    content: `🔄 **Cluster Update Assistant**\n\nI'm here to help with your OpenShift update! I can:\n\n• Assess cluster readiness and compatibility\n• Explain update process and timeline\n• Guide you through each step\n• Help with operator updates\n• Troubleshoot issues\n\nWhat would you like to know?`,
    suggestions: [
      'Assess readiness',
      'How long will it take?',
      'What are the risks?',
      'Start the update'
    ]
  };
}

function getHomePageResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  return {
    content: `🏠 **Welcome to Your OpenShift Cluster!**\n\nI can help you navigate and manage your cluster. Popular tasks:\n\n📊 **Overview:**\n• Check cluster health\n• View resource usage\n• Monitor workloads\n\n🔄 **Updates:**\n• Update cluster\n• Manage operators\n• Check compatibility\n\n🛠️ **Management:**\n• Deploy workloads\n• Configure networking\n• Manage storage\n\nWhere would you like to start?`,
    suggestions: [
      'Show cluster health',
      'Check for updates',
      'View installed operators',
      'Deploy an application'
    ]
  };
}

function getWorkloadsResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  return {
    content: `🚀 **Workloads Management**\n\nI can help you with:\n\n📦 **Deployments:**\n• Create new deployments\n• Scale workloads\n• Update strategies\n\n🔄 **Pods:**\n• View pod status\n• Debug pod issues\n• Check logs\n\n⚙️ **Resources:**\n• StatefulSets\n• DaemonSets\n• Jobs & CronJobs\n\nWhat would you like to do?`,
    suggestions: [
      'Show all pods',
      'Create new deployment',
      'Scale a deployment',
      'Troubleshoot pod issues'
    ]
  };
}

function getNetworkingResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  return {
    content: `🌐 **Networking Assistant**\n\nI can help you with:\n\n🔌 **Services:**\n• Create services\n• Configure load balancers\n• Check endpoints\n\n🛣️ **Routes:**\n• Expose applications\n• Configure ingress\n• Manage SSL/TLS\n\n🔒 **Network Policies:**\n• Control traffic flow\n• Security rules\n• Troubleshoot connectivity\n\nWhat do you need help with?`,
    suggestions: [
      'List all services',
      'Create a route',
      'Configure network policy',
      'Troubleshoot connectivity'
    ]
  };
}

function getStorageResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  return {
    content: `💾 **Storage Management**\n\nI can assist with:\n\n📁 **Persistent Volumes:**\n• View PVs and PVCs\n• Create storage\n• Resize volumes\n\n⚙️ **Storage Classes:**\n• List available classes\n• Configure defaults\n• Provisioner settings\n\n📊 **Capacity:**\n• Check usage\n• Monitor growth\n• Clean up resources\n\nHow can I help?`,
    suggestions: [
      'Show storage usage',
      'List persistent volumes',
      'Create new PVC',
      'Check storage classes'
    ]
  };
}

function getObserveResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  return {
    content: `📊 **Observability & Monitoring**\n\nI can help you:\n\n📈 **Metrics:**\n• View cluster metrics\n• Resource utilization\n• Performance trends\n\n🔔 **Alerts:**\n• Active alerts\n• Alert rules\n• Notification settings\n\n📝 **Logs:**\n• Search logs\n• Aggregate logs\n• Export logs\n\nWhat would you like to observe?`,
    suggestions: [
      'Show cluster metrics',
      'View active alerts',
      'Search logs',
      'Check performance'
    ]
  };
}

function getGeneralResponse(
  userInput: string,
  intent: any,
  navigate?: (path: string) => void
): AIResponse {
  const lowerInput = userInput.toLowerCase();
  
  // Jokes and fun
  if (/joke|funny|laugh/.test(lowerInput)) {
    const jokes = [
      "Why do Kubernetes pods make terrible comedians? They keep getting restarted before finishing their punchlines! 🤣\n\nBut hey, at least they're self-healing!",
      "What's a container's favorite snack? Microservices! 🍪\n\nOkay, that was bad... I'll stick to cluster management!",
      "Why did the etcd cluster go to therapy? It had consensus issues! 😅",
      "How many operators does it take to change a lightbulb? None! It's automated! 💡"
    ];
    return {
      content: jokes[Math.floor(Math.random() * jokes.length)],
      suggestions: ['Tell another joke', 'Show cluster health', 'Help me with operators']
    };
  }
  
  // Appreciation
  if (/thanks|thank you|great|awesome|helpful/.test(lowerInput)) {
    return {
      content: "You're very welcome! 😊 I'm here to help make OpenShift management easier for you.\n\nIs there anything else you'd like assistance with?",
      suggestions: [
        'Show cluster health',
        'Check for updates',
        'Manage operators'
      ]
    };
  }
  
  return {
    content: `I'm OpenShift LightSpeed, your AI assistant! I can help with:\n\n🔄 **Updates & Maintenance:**\n• Cluster updates\n• Operator management\n• Pre-checks\n\n💚 **Health & Monitoring:**\n• Cluster status\n• Resource usage\n• Troubleshooting\n\n🚀 **Workload Management:**\n• Deploy applications\n• Scale resources\n• Configure services\n\nWhat would you like to know?`,
    suggestions: [
      'Show cluster health',
      'Check for updates',
      'List installed operators',
      'Help me troubleshoot'
    ]
  };
}
