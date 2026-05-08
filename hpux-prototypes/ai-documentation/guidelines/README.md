# PatternFly Guidelines

Core development rules for AI coders building PatternFly React applications.

## Related Files

- [**Component Rules**](./component-architecture.md) - Component structure requirements
- [**Styling Rules**](./styling-standards.md) - CSS and styling requirements
- [**Layout Rules**](../components/layout/README.md) - Page structure requirements

## Essential Rules

### Version Requirements

- ✅ **ALWAYS use PatternFly v6** - Use `pf-v6-` prefixed classes only
- ❌ **NEVER use legacy versions** - No `pf-v5-`, `pf-v4-`, or `pf-c-` classes
- ✅ **Match component and CSS versions** - Ensure compatibility

### Component Usage Rules

- ✅ **Use PatternFly components first** - Before creating custom solutions
- ✅ **Compose components** - Build complex UIs by combining PatternFly components
- ❌ **Don't override component internals** - Use provided props and APIs

### Tokenss
- ✅ **ALWAYS use PatternFly tokens** - Use `pf-t-` prefixed classes over `pf-v6-` classes (e.g., `var(--pf-t--global--spacer--sm)` not `var(--pf-v6-global--spacer--sm)`)

### Text Components (v6+)
```jsx
// ✅ Correct
import { Content } from '@patternfly/react-core';
<Content component="h1">Title</Content>

// ❌ Wrong - Don't use old Text components
<Text component="h1">Title</Text>
```

### Icon Usage
```jsx
// ✅ Correct - Wrap with Icon component
import { Icon } from '@patternfly/react-core';
import { UserIcon } from '@patternfly/react-icons';
<Icon size="md"><UserIcon /></Icon>
```

### Styling Rules

- ✅ **Use PatternFly utilities** - Before writing custom CSS
- ✅ **Use semantic design tokens** for custom CSS (e.g., `var(--pf-t--global--text--color--regular)`), not base tokens with numbers (e.g., `--pf-t--global--text--color--100`) or hardcoded values
- ❌ **Don't mix PatternFly versions** - Stick to v6 throughout

### Layout & Spacing Rules

**IMPORTANT: PatternFly's `Page` component ignores inline padding styles!**

#### Use Plain `<div>` When You Need Custom Padding:

```jsx
// ✅ CORRECT - Full control over padding
<div style={{ 
  height: '100vh',
  padding: '24px',
  boxSizing: 'border-box',
  backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
  overflow: 'auto'
}}>
  {/* Your content */}
</div>

// ❌ WRONG - Page component ignores inline padding
<Page style={{ padding: '24px' }}>
  <PageSection>...</PageSection>
</Page>
```

#### When to Use Each Approach:

**Use Plain `<div>` for:**
- Launcher pages with custom padding requirements
- Full-page layouts that need precise spacing control (e.g., 24px padding on all sides)
- Standalone pages without navigation/sidebar
- When PatternFly's `Page` styling conflicts with your design

**Use `<Page>` Component for:**
- Standard application pages with masthead, sidebar, and navigation
- Pages that follow PatternFly's standard layout patterns
- When you need built-in responsive behavior

#### Key Requirements for Custom Layouts:
1. **Always use `boxSizing: 'border-box'`** - Prevents padding from adding to width/height
2. **Set `overflow: 'auto'`** - Enables scrolling for long content
3. **Use PatternFly design tokens** - For colors: `var(--pf-v5-global--BackgroundColor--100)`
4. **Remove unused imports** - Don't import `Page`/`PageSection` if using plain divs

### Documentation Requirements

1. **Check [PatternFly.org](https://www.patternfly.org/) first** - Primary source for APIs
2. **Check the [PatternFly React GitHub repository](https://github.com/patternfly/patternfly-react)** for the latest source code, examples, and release notes
3. **Use "View Code" sections** - Copy working examples
4. **Reference version-specific docs** - Match your project's PatternFly version
5. **Provide context to AI** - Share links and code snippets when asking for help

> For the most up-to-date documentation, use both the official docs and the source repositories. When using AI tools, encourage them to leverage context7 to fetch the latest documentation from these sources.

### Accessibility Requirements

- ✅ **WCAG 2.1 AA compliance** - All components must meet standards
- ✅ **Proper ARIA labels** - Use semantic markup and labels
- ✅ **Keyboard navigation** - Ensure full keyboard accessibility
- ✅ **Focus management** - Logical focus order and visible indicators

## Quality Checklist

- [ ] Uses PatternFly v6 classes only
- [ ] Components render correctly across browsers
- [ ] Responsive on mobile and desktop
- [ ] Keyboard navigation works
- [ ] Screen readers can access content
- [ ] No console errors or warnings
- [ ] Performance is acceptable

## When Issues Occur

1. **Check [PatternFly.org](https://www.patternfly.org/)** - Verify component API
2. **Inspect elements** - Use browser dev tools for PatternFly classes
3. **Search [GitHub issues](https://github.com/patternfly/patternfly-react/issues)** - Look for similar problems
4. **Provide context** - Share code snippets and error messages

See [Common Issues](../troubleshooting/common-issues.md) for specific problems.