# Option C: Group Role Assignment Wizard

## Branch: `option-c-development`
## Commit: 25fa5f3d

## Description
This is the current implementation of the Group Role Assignment Wizard with a hierarchical selection flow focused on cluster and project-level access control.

## Key Features

### Step Structure
1. **Scope** (formerly "Select resources")
   - Substep 1: Select clusters
   - Substep 2: Define granularity
2. **Role**
3. **Review**

### Select Clusters Substep
- Multi-select clusters table with bulk selector
- Cluster set filter with multi-select (checkmarks on right side)
- Filter shows: "All cluster sets", single name, or "X cluster sets"
- Clickable rows for selection
- Enhanced bulk selector with dropdown options (select none/page/all)

### Define Granularity Substep
- **Disabled until clusters are selected** (grayed out, not-allowed cursor)
- Two radio button options with proper grouping and spacing (1.5rem between groups):

#### Single Cluster Selected:
1. **Cluster role assignment**
   - Grant access to **all current and future resources** on the selected cluster.
2. **Project role assignment**
   - Grant access to **specific projects** on the cluster.

#### Multiple Clusters Selected:
1. **Cluster role assignment**
   - Grant access to **all current and future resources** on the selected clusters.
2. **Common projects role assignment**
   - Grant access to projects with the same name across selected clusters.

### Projects Table
- Appears below "Project role assignment" / "Common projects role assignment" when selected
- Same enhanced bulk selector as clusters table
- Clickable rows
- Shows project name and associated clusters (for common projects)

### Left Navigation
- Substeps always visible and clickable
- Can jump directly to any substep
- Grayed out substeps become enabled as prerequisites are met
- Hover effects on clickable substeps

## UX Enhancements
- Clean title/description pair for each substep
- Medium font weight (500) on key phrases: "all current and future resources", "specific projects"
- Proper visual separation between radio button groups
- Consistent bulk selector pattern across all tables

## Future Consideration
Option C currently requires explicit cluster selection. For whole cluster set selection (allowing all current and future resources in a cluster set without selecting individual clusters), consider:
- Adding a choice at the beginning: "Select cluster set(s)" vs "Select specific clusters"
- Or adding a third radio option: "Cluster set role assignment"

## How to Restore
```bash
git checkout option-c-development
```

Or to compare with current branch:
```bash
git diff main option-c-development
```

