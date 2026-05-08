# Group Role Assignment Wizard - Drawer Implementation

This file contains the necessary changes to implement the examples drawer in GroupRoleAssignmentWizard, similar to ClusterSetRoleAssignmentWizard.

## Changes Made:

1. **Import TimesIcon**
2. **Add `isDrawerExpanded` state**
3. **Add drawer overlay structure to Modal body**
4. **Add "View examples" button to title**
5. **Remove/hide inline ExpandableSection components**

## Note:
The full example tree view content from the three ExpandableSection blocks needs to be copied into the drawer.
The examples are currently located at:
- Lines 809-1958: Cluster sets examples (resourceScope === 'cluster-sets')
- Lines 2052-2396: Clusters examples (resourceScope === 'clusters')  
- Lines 2531-2944: Everything examples (resourceScope === 'everything')

Each section contains detailed tree view examples with carousel navigation that should be migrated to the drawer's content area.

