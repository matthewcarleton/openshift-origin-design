# Standard Page Template Pattern

## ⚠️ MANDATORY RULE: Use Standard Page Layout for ALL New Pages

**THIS IS NOT OPTIONAL. When creating ANY new page or navigation item, you MUST use this standard page layout.**

This ensures consistency across all prototypes and matches the established design patterns. The layout includes proper padding, breadcrumbs, title/description, and a table with toolbar in a card.

## 🚨 CRITICAL RULE FOR AI ASSISTANTS

**Whenever a user asks for:**
- A new page
- A navigation item
- A subnav item
- A page layout
- Any page creation

**You MUST automatically create a page with this EXACT layout structure and paddings. DO NOT ask the user - just apply it automatically.**

**This rule applies to:**
- All new pages in prototypes
- All navigation items
- All subnav items
- Any page layout request

**There are NO exceptions. Every page MUST follow this pattern.**

## Page Structure

Every new page MUST follow this structure:

```
┌─────────────────────────────────────────┐
│ Breadcrumbs Section (16px padding)      │
├─────────────────────────────────────────┤
│ Heading Section (24px padding)          │
│ • Title (h1, 2xl)                      │
│ • Description (Content component)        │
├─────────────────────────────────────────┤
│ Content Area (24px padding)             │
│ ┌─────────────────────────────────────┐ │
│ │ Card (table-content-card)            │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Toolbar                         │ │ │
│ │ │ [Bulk] [Filter] [Search] [Btn] │ │ │
│ │ │ [Pagination - Top]               │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Table                            │ │ │
│ │ │ [Rows with selection]            │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Pagination - Bottom              │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Required Sections

### 1. Breadcrumbs Section
- **CSS Class:** `template-page-breadcrumb`
- **Padding:** 16px all sides
- **Content:** `Breadcrumb` component with `BreadcrumbItem`s
- **Required:** Yes (unless it's a root/home page)

### 2. Heading Section
- **CSS Class:** `template-page-heading`
- **Padding:** 24px all sides
- **Content:**
  - `Title` component (headingLevel="h1", size="2xl")
  - `Content` component with description paragraph
- **Required:** Yes

### 3. Content Area
- **CSS Class:** `template-page-content`
- **Padding:** 24px all sides
- **Content:** Card with toolbar, table, and pagination
- **Required:** Yes

## Card Structure

The content area MUST contain a card with:

### Toolbar (Top)
- Bulk selector dropdown
- Filter dropdown
- Search input
- Primary action button (e.g., "Create")
- Pagination (compact, top variant, aligned right)

### Table
- Selection checkboxes
- Column headers
- Data rows
- Paginated (shows only current page)

### Pagination (Bottom)
- Full pagination controls
- Bottom variant
- Border-top separator

## CSS Classes

**CRITICAL:** Use these CSS classes - they have `!important` flags to ensure padding works correctly.

```css
/* Breadcrumbs - 16px padding */
.template-page-breadcrumb {
  padding: 16px !important;
  background-color: #ffffff !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

/* Heading - 24px padding */
.template-page-heading {
  padding: 24px !important;
  background-color: #ffffff !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

/* Content - 24px padding */
.template-page-content {
  padding: 24px !important;
  background-color: #f5f5f5 !important;
}

/* Card wrapper */
.table-content-card {
  background-color: #ffffff !important;
  border-radius: 8px !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}
```

## Complete Example

```typescript
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  SearchInput,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  FilterIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

export const MyNewPage: React.FC = () => {
  const navigate = useNavigate();

  // Toolbar state
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Your data
  const columns = ['Name', 'Status', 'Created', 'Actions'];
  const allRows = [
    { id: 1, name: 'Item 1', status: 'Active', created: '2024-01-15', actions: 'View' },
    // ... more rows
  ];

  // Filter and search
  const filteredRows = useMemo(() => {
    return allRows.filter(row => {
      if (searchValue && !row.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredRows.map(row => row.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedRows.forEach(row => newSelected.add(row.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleSelectItem = (itemId: number, isSelecting: boolean) => {
    const newSelected = new Set(selectedItems);
    if (isSelecting) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const isAllSelected = paginatedRows.length > 0 && paginatedRows.every(row => selectedItems.has(row.id));

  return (
    <>
      {/* Breadcrumbs Section - 16px padding */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem isActive>My New Page</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section - 24px padding */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          My New Page
        </Title>
        <Content>
          <p>This is a new page with breadcrumbs, title, description, and a table.</p>
        </Content>
      </div>

      {/* Content Area - 24px padding */}
      <div className="template-page-content">
        {/* Card wrapping toolbar and table */}
        <div className="table-content-card">
          {/* Toolbar */}
          <Toolbar>
            <ToolbarContent style={{ gap: '8px' }}>
              {/* Bulk Selector */}
              <ToolbarItem>
                <Dropdown
                  isOpen={isBulkSelectorOpen}
                  onSelect={() => setIsBulkSelectorOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsBulkSelectorOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => {
                        if (selectedItems.size > 0) {
                          handleDeselectAll();
                        } else {
                          setIsBulkSelectorOpen(!isBulkSelectorOpen);
                        }
                      }}
                      variant="plain"
                      style={{
                        border: '1px solid var(--pf-t--global--border--color--default)',
                        borderRadius: 'var(--pf-t--global--border--radius--small)',
                        padding: '6px 8px',
                        minWidth: 'auto',
                      }}
                    >
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Checkbox
                            isChecked={isAllSelected}
                            onChange={(event, checked) => {
                              event.stopPropagation();
                              if (checked) {
                                handleSelectAll();
                              } else {
                                handleDeselectAll();
                              }
                            }}
                            aria-label="Select all"
                          />
                        </FlexItem>
                        <FlexItem>
                          <CaretDownIcon />
                        </FlexItem>
                      </Flex>
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="select-page" onClick={handleSelectPage}>
                      Select page ({paginatedRows.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredRows.length} items)
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Filter Dropdown */}
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterOpen}
                  onSelect={() => setIsFilterOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      isExpanded={isFilterOpen}
                      variant="default"
                    >
                      <FilterIcon /> Filter
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="status">Status</DropdownItem>
                    <DropdownItem key="created">Created date</DropdownItem>
                    <DropdownItem key="name">Name</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Primary Action Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => console.log('Create clicked')}>
                  Create
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredRows.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={onSetPage}
                  onPerPageSelect={onPerPageSelect}
                  variant={PaginationVariant.top}
                  isCompact
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          {/* Table */}
          <Table aria-label="Example table">
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_event, isSelecting) => {
                      if (isSelecting) {
                        handleSelectAll();
                      } else {
                        handleDeselectAll();
                      }
                    },
                    isSelected: isAllSelected,
                    isHeaderSelectDisabled: filteredRows.length === 0,
                  }}
                />
                {columns.map((column, index) => (
                  <Th key={index}>{column}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedRows.map((row) => (
                <Tr key={row.id}>
                  <Td
                    select={{
                      rowIndex: row.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(row.id, isSelecting),
                      isSelected: selectedItems.has(row.id),
                    }}
                  />
                  <Td dataLabel={columns[0]}>{row.name}</Td>
                  <Td dataLabel={columns[1]}>{row.status}</Td>
                  <Td dataLabel={columns[2]}>{row.created}</Td>
                  <Td dataLabel={columns[3]}>{row.actions}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Pagination at bottom */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
            <Pagination
              itemCount={filteredRows.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>
    </>
  );
};
```

## Quick Reference

### Required Imports
```typescript
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  SearchInput,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  FilterIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
```

### Required State
```typescript
// Toolbar state
const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [searchValue, setSearchValue] = useState('');
const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

// Pagination state
const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(10);
```

### Required CSS Classes
- `template-page-breadcrumb` (16px padding)
- `template-page-heading` (24px padding)
- `template-page-content` (24px padding)
- `table-content-card` (card wrapper)

## Rules

### ✅ DO:
1. **ALWAYS** use the exact CSS classes specified
2. **ALWAYS** include all three sections (breadcrumbs, heading, content)
3. **ALWAYS** wrap table and toolbar in `table-content-card` div
4. **ALWAYS** include pagination at top and bottom
5. **ALWAYS** use the exact padding values (16px for breadcrumbs, 24px for heading/content)
6. **ALWAYS** include toolbar with bulk selector, filter, search, and primary button
7. **ALWAYS** make table rows selectable with checkboxes

### ❌ DON'T:
1. **NEVER** use inline padding styles - use CSS classes
2. **NEVER** skip any section (breadcrumbs, heading, content)
3. **NEVER** put table directly in content area - must be in card
4. **NEVER** forget pagination
5. **NEVER** use different padding values
6. **NEVER** create custom layouts - use this template

## When to Use This Pattern

**MANDATORY - ALWAYS use this pattern when:**
- User asks for a "new page"
- User asks for a "navigation item"
- User asks for a "subnav item"
- User asks for a "table page"
- User asks for a "list page"
- User asks for a "page layout"
- User asks for ANY page creation

**⚠️ IMPORTANT:** This pattern is MANDATORY. Do NOT create pages without this structure. Do NOT ask the user if they want this layout - just apply it automatically.

**You can customize:**
- Page title and description
- Table columns and data
- Filter options
- Primary button label and action
- Breadcrumb items
- Content inside the content area (buttons, cards, etc.)

**You MUST keep (NO EXCEPTIONS):**
- Layout structure (breadcrumbs, heading, content)
- CSS classes and padding values
- Card wrapper for table (if using a table)
- Toolbar structure (if using a table)
- Pagination at top and bottom (if using a table)

**If the page doesn't need a table:**
- Still use breadcrumbs, heading, and content sections
- Content area can contain buttons, cards, or other components
- Still use the exact CSS classes and padding values

## Benefits

- ✅ Consistent user experience across all prototypes
- ✅ Professional, polished appearance
- ✅ No padding troubleshooting needed - CSS classes handle it
- ✅ Easy to maintain and update
- ✅ Matches established design patterns
- ✅ Ready-to-use template saves time

## Quick Start for New Pages

**🚨 FOR AI ASSISTANTS: When a user asks for a new page, follow these steps:**

1. **Copy the boilerplate:** Use `PAGE_TEMPLATE_BOILERPLATE.tsx` as your starting point
2. **Rename the component:** Change `YourNewPage` to the actual page name
3. **Update breadcrumbs:** Customize the breadcrumb items
4. **Update heading:** Change title and description
5. **Customize content:** Update table data, buttons, or other content
6. **Keep the structure:** DO NOT modify the layout structure or CSS classes

**⚠️ DO NOT:**
- Ask the user if they want this layout (just apply it)
- Create pages without this structure
- Modify the CSS classes or padding values
- Skip any of the three sections (breadcrumbs, heading, content)

## See Also

- `PAGE_TEMPLATE_BOILERPLATE.tsx` - **COPY THIS FOR NEW PAGES**
- `pages/NewPage.tsx` - Complete working example with table
- `pages/OverviewPage.tsx` - Example with buttons (uses template structure)
- `README.md` - Template overview
- `WIZARD_PATTERN.md` - Wizard patterns

