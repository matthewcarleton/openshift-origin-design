# Project: Multi-Cluster Alerting UI

## Overview
This prototype is a dashboard for managing alerts across many different computer clusters (Fleet). It helps users see which clusters are "unhealthy" at a glance using a visual Treemap.

## Key Features 
1. **Fleet Overview (Treemap):** - Big squares show clusters. 
   - **Red** = Critical, **Yellow** = Warning, **Blue** = Info, **Green** = Healthy.
2. **Fleet Health Insights:** - Includes a bar chart showing which components (like 'Storage' or 'Network') are failing most often.
   - Includes a "Spike" timeline that shows when alert volume goes up suddenly.
3. **Alert List:** - A searchable table of every alert.
   - Users can "Group by" things like Severity, Cluster, or Component.
4. **Management Tab:** - Where users create "Alert Rules" (the logic that triggers a notification).
   - Includes a "Silence Rules" section to temporarily turn off noisy alerts.

## Developer Instructions for Cursor AI
When you open this project in Cursor, please follow these rules:
- **Design Style:** Use the "PatternFly" or "OpenShift" style (clean white backgrounds, standard alert colors).
- **Interactive Elements:** Ensure the Treemap squares are clickable and filter the list.
- **Data Handling:** Use the `mock-alerts.json` file to populate the charts and tables.

## Folder Contents
- `/ui-prototype`: The actual code for this demo.
