Create a multi-page interactive prototype for an OpenShift Console "Cluster Updates" experience. Use PatternFly component patterns throughout. Build 7 pages/frames representing different states of the same view. Use the Unified Theme design tokens for all colors, typography, spacing, and component styling.

Global Shell (present on every page):

Masthead: Red Hat OpenShift logo + "UNIFIED THEME" badge on the left. Right side: "Contact: Kyle Baker" label, help icon, notification bell icon, and an orange avatar circle with initials "CA".
Left sidebar navigation: Section header "< CORE PLATFORMS" followed by nav items: Home, Favorites, Operators ›, Helm, Workloads ›, Virtualization ›, Migration ›, GitOps ›, Serverless ›, Networking ›, Storage ›, Builds ›, Pipelines ›, Observe ›, Compute ›, User Management ›. Then a divider. Then "Administration ▾" section header with children: Updates (active/highlighted), Namespaces, CustomResourceDefinitions. The active "Updates" item has a left red accent border.
Page 1 — Dashboard (default state):

Content area with breadcrumb: "Administration › Updates"

Page title: "Cluster Updates" with right-aligned links: a pencil icon with "/relevy/updates" and "Cluster update history".

Card 1 — "Update Management": Subtitle: "Choose how cluster updates are managed" Two side-by-side selectable cards:

Left card (selected, red border): Radio button + "Manual upgrades" + green "ENABLED" badge. Description: "Manually manage version upgrades for the cluster. You will need to approve each update individually."
Right card (unselected): Radio button + "Agent-based upgrades" + purple "PREVIEW" badge. Description: "Let the AI agent manage upgrades automatically. It analyzes optimal windows and performs safety checks before upgrading."
Card 2 — "Cluster Details": Top-right: "Ask OLS" gradient pill button (purple-blue-teal gradient). Detail rows (label-value grid):

Current version: 5.0.0
Upstream update service: Default update service (with external link icon)
Channel: Dropdown showing "fast-5.1" + red "Help me choose" link + blue "What are channels?" link
Cluster ID: 1c182077-5663-426d-92a3-5d26df31f146 (monospace)
Section — "Available Updates": Title with blue "Explain updates" link beside it. Toggle switch row: "Show only 5.0 Z-stream updates"

Blue announcement banner with sparkle icon: "OpenShift 5.1 is available! Includes OVN network improvements, enhanced node management, and AI workload scheduling. See what's new in 5.1 →"

Collapsible version group "5.1" (3 releases):

Version	Badges	Details	Date
5.1.10	★ Recommended (blue), Low Risk (green)	4 features · 12 bug fixes	Mar 22, 2026
5.1.9	Low Risk (green)	2 features · 8 bug fixes	Mar 16, 2026
5.1.8	Medium Risk (gold)	3 features · 15 bug fixes	Mar 8, 2026
Collapsible version group "5.0" (4 releases): | 5.0.8 | Low Risk | 0 features · 6 bug fixes | | | 5.0.7 | Low Risk | 0 features · 4 bug fixes | |

Page 2 — Version Detail: Back link: "← Back to Cluster Updates" Title: "OpenShift 5.1.10" with a primary "Update to this version" button. Inline badges: ★ Recommended, Low Risk, "Released Mar 22, 2026"

Card — "Risk Assessment" (label-value grid):

Breaking changes: None detected (green)
Deprecated APIs: 1 minor, non-blocking (gold)
Known issues: 0 open (green)
Errata advisories: 2 security, 3 bug fix, 1 enhancement
Card — "Release Highlights" (list with typed badges):

FEATURE: OVN-Kubernetes dual-stack gateway improvements
FEATURE: Node health check operator GPU workload awareness
FEATURE: AI workload scheduling hints for InferenceService pods
FEATURE: Console cluster update experience with agent-based path
SECURITY: CVE-2026-1234 containerd privilege escalation fix
SECURITY: CVE-2026-5678 etcd TLS certificate validation hardening
BUG FIX: Fixed intermittent node NotReady during pod eviction
BUG FIX: Resolved PVC resize stuck for Ceph RBD
BUG FIX: MachineConfigPool rollout respects maxUnavailable
Page 3 — Pre-flight Checks: Title: "Pre-flight Checks — 5.1.10" Subtitle: "Validating cluster readiness before initiating the update."

Card with "Run checks" secondary button. When run, show a vertical timeline of 7 checks with connector lines between them. Each check shows a status icon (green checkmark for pass), check name, and description:

Cluster version operator — Verify CVO health
API server availability — Check kube-apiserver readiness
etcd cluster health — Verify etcd quorum and disk latency
Node readiness — All 15 nodes reporting Ready
Pod disruption budgets — Validate PDBs allow drain
Persistent volume claims — Check PVC binding
Network policy validation — Verify CNI compatibility
All checks passed state. "Begin update" primary button becomes enabled.

Page 4 — Updating (in progress): Title: "Updating to 5.1.10" with a red "Pause update" button.

Card with circular progress ring showing 65% (blue arc on grey track). Beside it:

Control plane: Updated ✓ (green)
Worker nodes: 8 of 12 updated
Estimated time remaining: ~48 minutes
Card — "Node Rollout": Grid of node chips:

control-0, control-1, control-2: green "updated" state
worker-0 through worker-6, worker-5, worker-6: green "updated"
worker-7: blue "in-progress" with spinner icon
worker-8, worker-9, worker-10, worker-11: grey "pending"
Page 5 — Success: Large centered success banner with green circle checkmark icon. Title: "Cluster Updated Successfully" Description: "Your cluster has been updated to OpenShift 5.1.10. All 15 nodes are healthy."

Card — "Post-Update Summary" (label-value grid):

Previous version: 5.0.0
New version: 5.1.10 (green)
Duration: 2 hours 12 minutes
Nodes updated: 15 of 15
Operators updated: 28 of 28
Downtime: Zero (rolling update) (green)
"Return to Updates" primary button.

Page 6 — Failed: Large centered failure banner with red circle X icon. Title: "Update Failed" Description: "The update to 5.1.10 was interrupted. Your cluster has been safely rolled back to 5.0.0."

Card — "Failure Details" (label-value grid):

Failed at: Worker node rollout (worker-7)
Error: MachineConfigPool degraded, node drain timeout (red text)
Root cause: PDB "billing-api-pdb" blocked eviction (maxUnavailable: 0)
Rollback status: Complete — cluster restored to 5.0.0 (green)
Card with purple/blue gradient border — "OLS Recommendation": AI icon + explanation that the PDB blocked drain. Suggests setting maxUnavailable: 1 temporarily. Two buttons: "Apply fix & retry" (primary) and "View CLI command" (secondary).

Page 7 — Agent Mode: Title: "Agent-Based Upgrades" with purple "PREVIEW" badge.

Card with gradient background and purple border, top gradient accent stripe:

Green pulsing dot + "Upgrade Agent Active" + "Last check: 3 minutes ago"
Description of the agent behavior
Detail grid: Current version 5.0.0, Next planned upgrade 5.1.10 on Apr 2 2026 02:00 UTC, Maintenance window Tue-Thu 02:00-06:00 UTC, Auto-rollback Enabled (green), Approval mode: Auto-approve Low Risk / Manual for Medium+
Card — "Agent Activity Log" (timeline entries):

14:32 — Low Risk badge — Evaluated 5.1.10, auto-approved, scheduled
09:15 — Scanned upstream, found 5.1.10 (recommended)
Mar 28 — Medium Risk badge — Evaluated 5.1.8, flagged for manual review
Mar 25 — Health check complete, all nodes healthy
Mar 22 — ✓ Successfully upgraded 4.18.6 → 5.0.0, 1h 48m, zero downtime (green)
Card — "Agent Configuration":

Channel preference dropdown: fast / stable
Risk tolerance dropdown: Low only (auto) / Medium (manual) / All
Notification channel: Slack #ops-cluster-updates, Email ops@acme.com
"Edit configuration" secondary button + "Disable agent" destructive link
Prototype wiring:

Clicking a version row on the Dashboard navigates to Version Detail
"Update to this version" on Version Detail navigates to Pre-flight
"Begin update" on Pre-flight navigates to Updating
Clicking the "Agent-based upgrades" card on the Dashboard navigates to Agent Mode
Back links return to the Dashboard