import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import type {
  ClusterData,
  GroupByOption,
  ImportanceSizing,
  AlertSeverity,
  AlertData,
  EnvironmentCategory,
  TeamCategory,
} from '../data/types';
import { getClusterAlertStatus, getTileValue } from '../data/utils';

interface TreemapHeatmapProps {
  clusters: ClusterData[];
  groupBy: GroupByOption;
  importanceSizing: ImportanceSizing;
  severityFilter: AlertSeverity[];
  onDrillDown: (cluster: ClusterData) => void;
  onLegendClick?: (severity: 'Critical' | 'Warning' | 'Info' | 'Healthy') => void;
  activeLegendFilters?: ('Critical' | 'Warning' | 'Info' | 'Healthy')[];
  environmentCategories?: EnvironmentCategory[];
  teamCategories?: TeamCategory[];
}

export const TreemapHeatmap: React.FC<TreemapHeatmapProps> = ({
  clusters,
  groupBy,
  importanceSizing,
  severityFilter,
  onDrillDown,
  onLegendClick,
  activeLegendFilters = [],
  environmentCategories = [],
  teamCategories = [],
}) => {
  // PatternFly 6 color palette
  // Critical: Red, Warning: Orange, Info: Purple, Healthy: Green
  const pfColors = {
    critical: '#c9190b',    // PF danger/red
    warning: '#f0ab00',     // PF warning/orange  
    info: '#6753ac',        // PF purple
    healthy: '#3e8635',     // PF success/green
  };

  const getClusterColor = (cluster: ClusterData): string => {
    const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
    if (firingAlerts.some(a => a.severity === 'Critical')) return pfColors.critical;
    if (firingAlerts.some(a => a.severity === 'Warning')) return pfColors.warning;
    if (firingAlerts.some(a => a.severity === 'Info')) return pfColors.info;
    return pfColors.healthy;
  };

  const getStatusText = (cluster: ClusterData): string => {
    const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
    if (firingAlerts.some(a => a.severity === 'Critical')) return 'Critical';
    if (firingAlerts.some(a => a.severity === 'Warning')) return 'Warning';
    if (firingAlerts.some(a => a.severity === 'Info')) return 'Info';
    return 'Healthy';
  };

  const buildTreemapData = () => {
    // Filter clusters based on severity filter - hide healthy clusters when filtering
    let filteredClusters = clusters;
    if (severityFilter.length > 0 || activeLegendFilters.length > 0) {
      filteredClusters = clusters.filter(cluster => {
        const clusterStatus = getClusterAlertStatus(cluster);
        const statusCapitalized = clusterStatus.charAt(0).toUpperCase() + clusterStatus.slice(1);
        
        // If legend filters are active, use them
        if (activeLegendFilters.length > 0) {
          return activeLegendFilters.includes(statusCapitalized as 'Critical' | 'Warning' | 'Info' | 'Healthy');
        }
        
        // If severity filter is active, filter out healthy clusters
        if (severityFilter.length > 0) {
          // Hide healthy clusters when severity filter is set
          if (clusterStatus === 'healthy') return false;
          // Only show clusters with matching severity
          const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
          return firingAlerts.some(a => severityFilter.includes(a.severity));
        }
        return true;
      });
    }

    // Severity order for sorting: Critical first, then Warning, Info, Healthy
    const severityOrder: Record<string, number> = { Critical: 0, Warning: 1, Info: 2, Healthy: 3 };
    const getClusterSeverityOrder = (cluster: ClusterData): number => {
      const status = getClusterAlertStatus(cluster);
      const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);
      return severityOrder[statusCapitalized] ?? 4;
    };

    // Calculate adjusted value for sorting: Critical items get highest priority (larger value multiplier)
    // This ensures treemap displays Critical first (left), then Warning, Info, Healthy (right)
    const getAdjustedValue = (cluster: ClusterData): number => {
      const baseValue = getTileValue(cluster, importanceSizing, severityFilter);
      const severityPriority = getClusterSeverityOrder(cluster);
      
      // When sizing is 'none', all tiles should be equal size
      // Use microscopic differences ONLY for sorting order without visible size change
      if (importanceSizing === 'none') {
        // Use tiny offsets to maintain sort order: Critical=0.000004, Warning=0.000003, Info=0.000002, Healthy=0.000001
        // This ensures proper ordering while appearing visually equal in size
        const microOffset = (4 - severityPriority) * 0.000001;
        return 1000 + microOffset;
      }
      
      // When grouping by severity, use a much smaller multiplier to keep groups balanced
      // When not grouping, use a very large multiplier to force left-to-right ordering
      if (groupBy === 'severity') {
        // Small multiplier: Critical=2.0, Warning=1.75, Info=1.5, Healthy=1.25
        // This keeps all severity groups visible while still showing relative importance
        const multiplier = 2.0 - (severityPriority * 0.25);
        return baseValue * multiplier;
      } else {
        // Much larger multiplier for non-grouped view to force visual ordering
        // Critical=1000x, Warning=100x, Info=10x, Healthy=1x
        // This creates enough value difference to overcome treemap's layout optimization
        const multiplier = Math.pow(10, 3 - severityPriority);
        return baseValue * multiplier;
      }
    };

    if (groupBy === 'none') {
      // Sort clusters by severity (Critical first)
      const sortedClusters = [...filteredClusters].sort((a, b) => {
        const severityDiff = getClusterSeverityOrder(a) - getClusterSeverityOrder(b);
        if (severityDiff !== 0) return severityDiff;
        const aCount = a.alerts.filter(al => al.status === 'firing').length;
        const bCount = b.alerts.filter(al => al.status === 'firing').length;
        if (aCount !== bCount) return bCount - aCount;
        return a.name.localeCompare(b.name);
      });
      return sortedClusters.map(cluster => ({
        name: cluster.name,
        value: getAdjustedValue(cluster),
        itemStyle: { color: getClusterColor(cluster) },
        cluster,
      }));
    }

    const groups: Record<string, ClusterData[]> = {};
    
    // Pre-initialize severity groups to ensure all show up
    if (groupBy === 'severity') {
      groups['Critical'] = [];
      groups['Warning'] = [];
      groups['Info'] = [];
      groups['Healthy'] = [];
    }
    
    filteredClusters.forEach(cluster => {
      let key: string;
      if (groupBy === 'severity') {
        key = getClusterAlertStatus(cluster).charAt(0).toUpperCase() + getClusterAlertStatus(cluster).slice(1);
      } else if (groupBy === 'environment') {
        // Match cluster name against environment patterns
        key = 'Other'; // Default to "Other" if no match
        for (const category of environmentCategories) {
          if (category.patterns.some(pattern => cluster.name.toLowerCase().startsWith(pattern.toLowerCase()))) {
            key = category.label;
            break;
          }
        }
      } else if (groupBy === 'team') {
        // Match cluster name against team patterns
        key = 'Other'; // Default to "Other" if no match
        for (const category of teamCategories) {
          if (category.patterns.some(pattern => cluster.name.toLowerCase().startsWith(pattern.toLowerCase()))) {
            key = category.label;
            break;
          }
        }
      } else {
        key = String(cluster[groupBy as keyof ClusterData]);
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(cluster);
    });

    // Sort groups by severity order (Critical first), then sort clusters within each group
    // For severity grouping, keep empty groups to show all severity levels
    // IMPORTANT: Use explicit ordering to ensure consistent left-to-right display
    let sortedGroupEntries: [string, ClusterData[]][];
    
    if (groupBy === 'severity') {
      // Explicit severity order: always Critical, Warning, Info, Healthy (left to right)
      const severityOrderedKeys = ['Critical', 'Warning', 'Info', 'Healthy'];
      sortedGroupEntries = severityOrderedKeys
        .map(key => [key, groups[key] || []] as [string, ClusterData[]])
        .filter(([groupName, groupClusters]) => {
          // When legend filters are active, only show groups that are in the filter
          if (activeLegendFilters.length > 0 && !activeLegendFilters.includes(groupName as 'Critical' | 'Warning' | 'Info' | 'Healthy')) {
            return false;
          }
          // When severity filter is active, hide empty groups so filtered-out severities don't take up space
          if (severityFilter.length > 0 && groupClusters.length === 0) {
            return false;
          }
          return true;
        });
    } else {
      // For other groupings, sort alphabetically
      sortedGroupEntries = Object.entries(groups)
        .filter(([_, groupClusters]) => groupClusters.length > 0)
        .sort((a, b) => a[0].localeCompare(b[0]));
    }

    // Calculate total value and group-level values for proper sizing
    const allGroupValues = sortedGroupEntries.map(([_, groupClusters]) => {
      return groupClusters.reduce((sum, c) => {
        // Use base value without severity multiplier for fair comparison
        return sum + getTileValue(c, importanceSizing, severityFilter);
      }, 0);
    });
    const totalBaseValue = allGroupValues.reduce((sum, v) => sum + v, 0);
    const avgGroupBaseValue = allGroupValues.length > 0 ? totalBaseValue / allGroupValues.length : 1000;
    
    return sortedGroupEntries.map(([groupName, groupClusters], groupIndex) => {
      // Sort clusters within group
      const sortedChildren = groupClusters
        .sort((a, b) => {
          // Sort by severity (Critical first), then by alert count, then by name
          const severityDiff = getClusterSeverityOrder(a) - getClusterSeverityOrder(b);
          if (severityDiff !== 0) return severityDiff;
          const aCount = a.alerts.filter(al => al.status === 'firing').length;
          const bCount = b.alerts.filter(al => al.status === 'firing').length;
          if (aCount !== bCount) return bCount - aCount;
          return a.name.localeCompare(b.name);
        })
        .map(cluster => ({
          name: cluster.name,
          value: getAdjustedValue(cluster),
          itemStyle: { color: getClusterColor(cluster) },
          cluster,
        }));
      
      // For empty groups (severity grouping), create a visible placeholder
      if (sortedChildren.length === 0) {
        const colorMap = { 
          Critical: pfColors.critical, 
          Warning: pfColors.warning, 
          Info: pfColors.info, 
          Healthy: pfColors.healthy 
        };
        const groupColor = colorMap[groupName as keyof typeof colorMap] || '#d2d2d2';
        // For severity grouping, ensure empty groups are at least 25% of the largest group for visibility
        const maxGroupBaseValue = allGroupValues.length > 0 ? Math.max(...allGroupValues) : 5000;
        const emptyGroupValue = groupBy === 'severity' 
          ? Math.max(maxGroupBaseValue * 0.25, 3000)
          : Math.max(avgGroupBaseValue * 0.4, 2000);
        
        const emptyLabel = '(0 clusters)';
        return {
          name: groupName,
          value: emptyGroupValue,
          itemStyle: {
            color: groupColor,
          },
          children: [{
            name: emptyLabel,
            value: emptyGroupValue,
            itemStyle: { 
              color: groupColor,
              opacity: 0.4,
              borderColor: '#ffffff',
              borderWidth: 2,
            },
            label: {
              show: true,
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 500,
            },
          }],
        };
      }
      
      // Calculate group value with stronger differentiation to enforce visual ordering
      const childrenSum = sortedChildren.reduce((sum, c) => sum + c.value, 0);
      
      // For severity grouping, use stronger multipliers to enforce left-to-right ordering
      // For other groupings, use a moderate multiplier to show importance
      let groupValue: number;
      if (groupBy === 'severity') {
        // When "Size by: None (equal size)" is selected, groups should also be equal size
        if (importanceSizing === 'none') {
          // Use equal base value with microscopic offsets for ordering only
          // Critical gets highest offset, Healthy gets lowest
          const microOffset = (3 - groupIndex) * 0.000001; // Critical=0.000003, Warning=0.000002, Info=0.000001, Healthy=0
          groupValue = 1000 + microOffset;
        } else {
          // Use explicit position-based multipliers to guarantee ordering
          // Critical (index 0) gets highest multiplier, Healthy (index 3) gets lowest
          // This creates a deterministic value hierarchy that ECharts must respect
          const severityMultipliers = [10000, 1000, 100, 10]; // Critical, Warning, Info, Healthy
          const severityMultiplier = severityMultipliers[groupIndex] || 1;
          groupValue = Math.max(childrenSum, 1000) * severityMultiplier;
          
          // Ensure a minimum value for visibility - at least 15% of the largest group
          const maxChildrenSum = Math.max(...sortedGroupEntries.map(([_, gc]) => 
            gc.reduce((sum, c) => sum + getAdjustedValue(c), 0)
          ));
          const minValue = maxChildrenSum * 0.15;
          groupValue = Math.max(groupValue, minValue);
        }
      } else {
        // For other groupings, use the original moderate multiplier
        const groupMultiplier = Math.pow(1.5, sortedGroupEntries.length - groupIndex);
        const maxGroupValue = childrenSum * 3; // Limit to 3x the sum of children
        groupValue = Math.min(childrenSum * groupMultiplier, maxGroupValue);
      }
      
      // Determine group color based on grouping type
      let groupItemStyle: any;
      if (groupBy === 'severity') {
        // For severity grouping, use severity colors
        const colorMap = { 
          Critical: pfColors.critical, 
          Warning: pfColors.warning, 
          Info: pfColors.info, 
          Healthy: pfColors.healthy 
        };
        groupItemStyle = { 
          color: colorMap[groupName as keyof typeof colorMap] || '#8a8d90'
        };
      } else {
        // For other grouping types (environment, team, region, etc.), use neutral gray
        groupItemStyle = { 
          color: '#d2d2d2'
        };
      }
      
      return {
        name: groupName,
        value: groupValue,
        children: sortedChildren,
        itemStyle: groupItemStyle,
      };
    });
  };

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const raw = e.target;
      const el =
        raw instanceof Element ? raw : (raw as Node).parentElement;
      const link = el?.closest?.('[data-treemap-view-all]') as HTMLElement | null;
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      const id = link.getAttribute('data-treemap-view-all');
      if (!id) return;
      const cluster = clusters.find(c => c.id === id);
      if (cluster) onDrillDown(cluster);
    };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [clusters, onDrillDown]);

  const option = {
    tooltip: {
      confine: true,
      enterable: true,
      hideDelay: 200,
      formatter: (info: any) => {
        if (!info.data?.cluster) {
          // Group header or empty placeholder tooltip
          // Check if this is an empty group placeholder
          if (info.name === '(0 clusters)' || info.name === '(0 groups)') {
            return `
              <div style="font-family: 'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <div style="font-size: 12px; color: #6a6e73;">No ${groupBy !== 'none' ? 'groups' : 'clusters'} in this ${groupBy === 'severity' ? 'severity' : 'category'}</div>
              </div>
            `;
          }
          // Distinguish root level (children are groups) from group headers (children are clusters)
          const children = info.data?.children || [];
          const isEmptyGroup = children.length === 1 && (children[0].name === '(0 clusters)' || children[0].name === '(0 groups)');
          const childCount = isEmptyGroup ? 0 : children.length;
          const depth = info.treePathInfo?.length || 1;
          const itemLabel = depth <= 1 ? 'group' : 'cluster';
          return `
            <div style="font-family: 'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
              <div style="font-size: 14px; font-weight: 600; color: #151515; margin-bottom: 4px;">${info.name}</div>
              <div style="font-size: 12px; color: #6a6e73;">${childCount} ${itemLabel}${childCount !== 1 ? 's' : ''}</div>
            </div>
          `;
        }
        const cluster = info.data.cluster as ClusterData;
        const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
        const status = getStatusText(cluster);
        const statusColor = getClusterColor(cluster);
        
        // Calculate component health - get worst severity per component
        const componentHealth: Record<string, { severity: string; color: string }> = {};
        firingAlerts.forEach(alert => {
          const comp = alert.component;
          const currentSeverity = componentHealth[comp]?.severity;
          // Determine priority: Critical > Warning > Info
          if (!currentSeverity || 
              (alert.severity === 'Critical') ||
              (alert.severity === 'Warning' && currentSeverity !== 'Critical') ||
              (alert.severity === 'Info' && currentSeverity !== 'Critical' && currentSeverity !== 'Warning')) {
            componentHealth[comp] = {
              severity: alert.severity,
              color: alert.severity === 'Critical' ? pfColors.critical : 
                     alert.severity === 'Warning' ? pfColors.warning : pfColors.info
            };
          }
        });
        
        // Build component health HTML
        const componentHealthHtml = Object.entries(componentHealth)
          .sort((a, b) => {
            const order = { Critical: 0, Warning: 1, Info: 2 };
            return (order[a[1].severity as keyof typeof order] || 3) - (order[b[1].severity as keyof typeof order] || 3);
          })
          .slice(0, 5) // Limit to 5 components
          .map(([comp, health]) => `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${health.color};"></span>
              <span style="font-size: 12px; color: #151515;">${comp}</span>
              <span style="font-size: 11px; color: ${health.color}; font-weight: 500;">${health.severity.toLowerCase()}</span>
            </div>
          `).join('');
        
        const moreComponents = Object.keys(componentHealth).length > 5 
          ? `<div style="font-size: 11px; color: #6a6e73; margin-top: 4px;">+${Object.keys(componentHealth).length - 5} more components</div>` 
          : '';
        
        const totalAlerts = cluster.alerts.filter(a => a.status === 'firing').length;
        
        return `
          <div style="font-family: 'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif; min-width: 220px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></span>
              <span style="font-size: 14px; font-weight: 600; color: #151515;">Cluster ${cluster.name}</span>
            </div>
            <div style="font-size: 12px; color: #6a6e73; margin-bottom: 12px;">${cluster.region} · ${cluster.cloudProvider}</div>
            ${Object.keys(componentHealth).length > 0 ? `
              <div style="margin-bottom: 8px;">
                <div style="font-size: 11px; font-weight: 600; color: #6a6e73; margin-bottom: 6px;">${Object.keys(componentHealth).length === 1 ? "Component's health" : "Components' health"}</div>
                ${componentHealthHtml}
                ${moreComponents}
              </div>
            ` : `
              <div style="font-size: 12px; color: ${pfColors.healthy}; margin-bottom: 8px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${pfColors.healthy}; margin-right: 6px;"></span>
                All components healthy
              </div>
            `}
            <div style="font-size: 12px; color: #6a6e73; padding-top: 8px; border-top: 1px solid #d2d2d2; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px;">
              <span>Nodes: <strong style="color: #151515;">${cluster.nodeCount}</strong></span>
              <span>Pods: <strong style="color: #151515;">${cluster.podCount}</strong></span>
              <span>Memory: <strong style="color: #151515;">${cluster.totalMemory} GB</strong></span>
              <span>VMs: <strong style="color: #151515;">${cluster.vmCount || 0}</strong></span>
              <span>Alerts: <strong style="color: ${totalAlerts > 0 ? statusColor : '#151515'};">${totalAlerts}</strong></span>
            </div>
            <div style="font-size: 12px; color: #6a6e73; margin-top: 10px;">Select the cluster to view all alerts</div>
            <div style="margin-top: 8px;">
              <a href="#" data-treemap-view-all="${cluster.id}" style="font-size: 12px; font-weight: 600; color: #0066cc; text-decoration: underline; cursor: pointer;">View all alerts</a>
            </div>
          </div>
        `;
      },
      backgroundColor: '#ffffff',
      borderColor: '#d2d2d2',
      borderWidth: 1,
      borderRadius: 4,
      padding: 12,
      extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);',
      textStyle: { 
        color: '#151515', 
        fontSize: 12, 
        fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif" 
      },
    },
    series: [{
      type: 'treemap',
      data: buildTreemapData(),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      roam: false,
      nodeClick: 'link',
      sort: 'descending', // Sort by value descending (larger values/Critical first)
      breadcrumb: {
        show: false,
      },
      label: {
        show: true,
        formatter: (params: any) => {
          const cluster = params.data?.cluster;
          if (cluster) {
            const status = getStatusText(cluster);
            // Show the value that box sizing is defined by (so user understands the tile size)
            const getSizingDisplayValue = (c: ClusterData): string => {
              switch (importanceSizing) {
                case 'none': return '';
                case 'nodeCount': return `${c.nodeCount} nodes`;
                case 'cpuCores': return `${c.cpuCores} cores`;
                case 'totalMemory': return `${c.totalMemory} GB`;
                case 'podCount': return `${c.podCount} pods`;
                case 'vmCount': return `${c.vmCount || 0} VMs`;
                case 'totalAlerts': return `${c.alerts.filter((a: AlertData) => a.status === 'firing').length} alerts`;
                case 'cpuRequests': return `${c.cpuRequests} CPU req`;
                case 'memoryRequests': return `${c.memoryRequests} mem req`;
                default: return '';
              }
            };
            const sizingValue = getSizingDisplayValue(cluster);
            
            // Determine icon and text style based on severity
            let icon = '';
            let stylePrefix = '';
            if (status === 'Critical') {
              icon = '!';
              stylePrefix = 'critical';
            } else if (status === 'Warning') {
              icon = '⚠';
              stylePrefix = 'warning';
            } else if (status === 'Info') {
              icon = 'ℹ';
              stylePrefix = 'info';
            } else {
              icon = '✓';
              stylePrefix = 'healthy';
            }
            
            return sizingValue 
              ? `{icon_${stylePrefix}|${icon}} {name_${stylePrefix}|${params.name}}\n{count_${stylePrefix}|${sizingValue}}` 
              : `{icon_${stylePrefix}|${icon}} {name_${stylePrefix}|${params.name}}`;
          }
          return `{name|${params.name}}`;
        },
        rich: {
          // Critical styles (white text on red)
          icon_critical: {
            fontSize: 14,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowBlur: 3,
            padding: [0, 4, 0, 0],
          },
          name_critical: {
            fontSize: 11,
            fontWeight: 600,
            color: '#ffffff',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
          count_critical: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
          // Warning styles (black text on orange for contrast)
          icon_warning: {
            fontSize: 14,
            fontWeight: 700,
            color: '#151515',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            padding: [0, 4, 0, 0],
          },
          name_warning: {
            fontSize: 11,
            fontWeight: 600,
            color: '#151515',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          },
          count_warning: {
            fontSize: 10,
            color: '#151515',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          },
          // Info styles (black text on purple for contrast)
          icon_info: {
            fontSize: 14,
            fontWeight: 700,
            color: '#151515',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            padding: [0, 4, 0, 0],
          },
          name_info: {
            fontSize: 11,
            fontWeight: 600,
            color: '#151515',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          },
          count_info: {
            fontSize: 10,
            color: '#151515',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          },
          // Healthy styles (white text on green)
          icon_healthy: {
            fontSize: 14,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowBlur: 3,
            padding: [0, 4, 0, 0],
          },
          name_healthy: {
            fontSize: 11,
            fontWeight: 600,
            color: '#ffffff',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
          count_healthy: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
          // Default fallback
          name: {
            fontSize: 11,
            fontWeight: 600,
            color: '#ffffff',
            fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
        },
        lineHeight: 14,
        align: 'center',
        verticalAlign: 'middle',
      },
      upperLabel: {
        show: groupBy !== 'none',
        height: 28,
        color: '#151515',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        borderRadius: [6, 6, 0, 0],
        padding: [6, 12],
        formatter: (params: any) => {
          const children = params.data?.children || [];
          // Check if this is an empty group placeholder (has 1 child with "0 clusters" in name)
          const isEmptyGroup = children.length === 1 && (children[0].name?.includes('(0 clusters)') || children[0].name?.includes('(0 groups)'));
          const childCount = isEmptyGroup ? 0 : children.length;
          return `${params.name} (${childCount})`;
        },
      },
      itemStyle: { 
        borderColor: '#ffffff', 
        borderWidth: 3, 
        gapWidth: 3,
        borderRadius: 6,
      },
      emphasis: { 
        itemStyle: { 
          borderColor: '#0066cc', 
          borderWidth: 3,
          borderRadius: 6,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 102, 204, 0.3)',
        },
      },
      levels: [
        { 
          // Level 0: Group containers
          itemStyle: { 
            borderColor: '#ffffff', 
            borderWidth: 4, 
            gapWidth: 4,
            borderRadius: 8,
          },
          upperLabel: {
            show: groupBy !== 'none',
            height: 28,
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: '#f5f5f5',
            borderRadius: [6, 6, 0, 0],
          },
        },
        { 
          // Level 1: Individual cluster tiles - always use their severity colors
          itemStyle: { 
            borderColor: '#ffffff', 
            borderWidth: 3, 
            gapWidth: 3,
            borderRadius: 6,
          },
        },
      ],
      animation: true,
      animationDurationUpdate: 200,
      animationEasing: 'cubicOut',
    }],
  };

  const handleClick = (params: any) => {
    if (params.data?.cluster) {
      onDrillDown(params.data.cluster);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Treemap container - compact height to show more tiles without scrolling */}
      <div style={{ width: '100%', height: groupBy !== 'none' ? '420px' : '280px', minHeight: '220px' }}>
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }} 
          onEvents={{ click: handleClick }}
          opts={{ renderer: 'svg' }}
          notMerge={true}
          lazyUpdate={false}
        />
      </div>
      {/* Legend - PatternFly aligned, clickable */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px', 
        padding: '16px',
        borderTop: '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
        marginTop: '12px',
        backgroundColor: 'var(--pf-t--global--background--color--secondary--default, #f5f5f5)',
        borderRadius: '0 0 var(--pf-t--global--border--radius--small, 3px) var(--pf-t--global--border--radius--small, 3px)',
      }}>
        {(['Critical', 'Warning', 'Info', 'Healthy'] as const).map(status => {
          const colorMap = { Critical: pfColors.critical, Warning: pfColors.warning, Info: pfColors.info, Healthy: pfColors.healthy };
          const isActive = activeLegendFilters.length === 0 || activeLegendFilters.includes(status);
          return (
            <div 
              key={status}
              onClick={() => onLegendClick?.(status)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: isActive ? '#ffffff' : '#f0f0f0',
                borderRadius: 'var(--pf-t--global--border--radius--small, 3px)',
                border: isActive 
                  ? `2px solid ${colorMap[status]}` 
                  : '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.5,
                transition: 'all 0.15s ease-in-out',
              }}
            >
              <span style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '3px', 
                background: colorMap[status],
                opacity: isActive ? 1 : 0.4,
              }}></span>
              <span style={{ 
                fontSize: '13px', 
                color: isActive ? '#151515' : '#6a6e73', 
                fontFamily: "'RedHatText', sans-serif", 
                fontWeight: 500 
              }}>{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
