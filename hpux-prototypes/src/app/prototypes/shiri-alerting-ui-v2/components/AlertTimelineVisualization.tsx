import * as React from 'react';
import {
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Content,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';

type AlertDetailTimeRange = '5m' | '30m' | '1h' | '6h' | '24h';

interface AlertTimelineVisualizationProps {
  alertName: string;
  severity: string;
}

export const AlertTimelineVisualization: React.FC<AlertTimelineVisualizationProps> = ({ alertName, severity }) => {
  const [timeRange, setTimeRange] = React.useState<AlertDetailTimeRange>('24h');
  
  // Generate timeline data based on time range
  const generateTimelineData = (range: AlertDetailTimeRange) => {
    const now = new Date();
    let startTime: Date;
    let intervalMinutes: number;
    let dataPoints: number;
    
    switch (range) {
      case '5m':
        startTime = new Date(now.getTime() - 5 * 60 * 1000);
        intervalMinutes = 0.5; // 30 seconds
        dataPoints = 10;
        break;
      case '30m':
        startTime = new Date(now.getTime() - 30 * 60 * 1000);
        intervalMinutes = 2;
        dataPoints = 15;
        break;
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        intervalMinutes = 4;
        dataPoints = 15;
        break;
      case '6h':
        startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        intervalMinutes = 24;
        dataPoints = 15;
        break;
      case '24h':
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        intervalMinutes = 96; // ~1.5 hours
        dataPoints = 15;
        break;
    }
    
    const events: Array<{ timestamp: Date; isFiring: boolean; duration: number }> = [];
    
    // Generate realistic flapping pattern
    let currentTime = startTime.getTime();
    let currentState = Math.random() > 0.5; // Start randomly firing or resolved
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(currentTime);
      const duration = intervalMinutes + Math.random() * intervalMinutes * 0.5;
      
      // Create some flapping: change state occasionally
      if (Math.random() > 0.7) {
        currentState = !currentState;
      }
      
      events.push({
        timestamp,
        isFiring: currentState,
        duration
      });
      
      currentTime += duration * 60 * 1000;
    }
    
    return events;
  };
  
  const timelineData = React.useMemo(() => generateTimelineData(timeRange), [timeRange]);
  
  const formatTime = (date: Date) => {
    if (timeRange === '5m' || timeRange === '30m') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else if (timeRange === '1h' || timeRange === '6h') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };
  
  const chartHeight = 300;
  const chartWidth = 700;
  const chartBarWidth = Math.max(20, Math.min(50, (chartWidth - 100) / timelineData.length - 8));
  const chartBarGap = 8;
  
  return (
    <Stack hasGutter>
      <StackItem>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Content component="h3" style={{ margin: 0 }}>Status Timeline</Content>
          </FlexItem>
          <FlexItem>
            <ToggleGroup aria-label="Time range selection">
              <ToggleGroupItem
                text="5 min"
                buttonId="5m"
                isSelected={timeRange === '5m'}
                onChange={() => setTimeRange('5m')}
              />
              <ToggleGroupItem
                text="30 min"
                buttonId="30m"
                isSelected={timeRange === '30m'}
                onChange={() => setTimeRange('30m')}
              />
              <ToggleGroupItem
                text="1 hour"
                buttonId="1h"
                isSelected={timeRange === '1h'}
                onChange={() => setTimeRange('1h')}
              />
              <ToggleGroupItem
                text="6 hours"
                buttonId="6h"
                isSelected={timeRange === '6h'}
                onChange={() => setTimeRange('6h')}
              />
              <ToggleGroupItem
                text="24 hours"
                buttonId="24h"
                isSelected={timeRange === '24h'}
                onChange={() => setTimeRange('24h')}
              />
            </ToggleGroup>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <div style={{ 
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: '4px',
          padding: '16px'
        }}>
          <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
            {/* Y-axis labels */}
            <text x="10" y="35" fontSize="12" fontWeight="600" fill="#151515">
              Firing
            </text>
            <text x="10" y={chartHeight - 50} fontSize="12" fontWeight="600" fill="#151515">
              Resolved
            </text>
            
            {/* Timeline bars */}
            <g transform="translate(80, 20)">
              {timelineData.map((event, idx) => {
                const x = idx * (chartBarWidth + chartBarGap);
                const barHeightValue = event.isFiring ? chartHeight - 100 : 50; // Tall for firing, short for resolved
                const y = chartHeight - 80 - barHeightValue;
                const color = event.isFiring 
                  ? '#C9190B' // Red for firing
                  : '#3E8635'; // Green for resolved
                
                return (
                  <g key={idx}>
                    <title>
                      {event.isFiring ? 'Firing' : 'Resolved'} - {formatTime(event.timestamp)} - Duration: ~{Math.round(event.duration)} min
                    </title>
                    <rect
                      x={x}
                      y={y}
                      width={chartBarWidth}
                      height={barHeightValue}
                      fill={color}
                      opacity={event.isFiring ? 0.9 : 0.5}
                      rx="3"
                      style={{ cursor: 'pointer' }}
                    />
                  </g>
                );
              })}
              
              {/* X-axis */}
              <line 
                x1="0" 
                y1={chartHeight - 80} 
                x2={timelineData.length * (chartBarWidth + chartBarGap) - chartBarGap} 
                y2={chartHeight - 80} 
                stroke="#D2D2D2" 
                strokeWidth="2"
              />
            </g>
            
            {/* Time labels */}
            <g transform="translate(80, 20)">
              {[0, Math.floor(timelineData.length / 2), timelineData.length - 1].map(idx => {
                if (idx >= 0 && idx < timelineData.length) {
                  const event = timelineData[idx];
                  const x = idx * (chartBarWidth + chartBarGap);
                  return (
                    <text 
                      key={idx}
                      x={x + chartBarWidth / 2} 
                      y={chartHeight - 55} 
                      fontSize="11" 
                      fill="#6A6E73"
                      textAnchor="middle"
                    >
                      {formatTime(event.timestamp)}
                    </text>
                  );
                }
                return null;
              })}
            </g>
          </svg>
        </div>
      </StackItem>
      <StackItem>
        <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: 'var(--pf-t--global--color--status--danger--default)',
                borderRadius: '2px',
                opacity: 0.9
              }} />
              <span style={{ fontSize: '13px' }}>Firing</span>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: 'var(--pf-t--global--color--status--success--default)',
                borderRadius: '2px',
                opacity: 0.4
              }} />
              <span style={{ fontSize: '13px' }}>Resolved</span>
            </Flex>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <Content component="p" style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)' }}>
          This visualization shows the alert status over time. Tall red bars indicate "Firing" periods, 
          while short light bars indicate "Resolved" periods. A sawtooth pattern indicates "flapping" behavior, 
          where the alert rapidly transitions between states.
        </Content>
      </StackItem>
    </Stack>
  );
};
