# Test Results: Explore Quotas Button Landing

## Current Configuration ✅

### Routes (routes.tsx)
- Root route (`/`) redirects to `/core/virtualization/quotas` ✅
- Quotas route configured with:
  - Path: `/core/virtualization/quotas`
  - Navigation group: `Virtualization`
  - Order: 10

### Perspective Setup
- Prototype config: `perspectives: ['core-platforms']` ✅
- AppLayout line 143: Sets perspective to 'Core platforms' when `currentPrototypeId === 'virtualization-quotas'` ✅

### Navigation Expansion
- AppLayout line 552: `isExpanded={group.routes.some((route) => route.path === location.pathname)}` ✅
- Should auto-expand "Virtualization" group when path matches

## Expected Behavior

When clicking "Explore quotas":
1. ✅ Prototype loads (virtualization-quotas)
2. ✅ Perspective switches to "Core platforms"
3. ✅ Root route redirects to `/core/virtualization/quotas`
4. ✅ Navigation should show "Virtualization" group expanded
5. ✅ "Quotas" should be highlighted/active

## Testing Steps

1. Run `npm start`
2. Click "Explore quotas" button
3. Verify:
   - [ ] Lands on Core platforms perspective
   - [ ] Virtualization nav group is expanded
   - [ ] Quotas page is visible
   - [ ] Quotas nav item is highlighted

## If Issues Found

Check:
- How prototype routes are merged with Core platforms navigation
- If the Virtualization group includes the Quotas route
- Browser console for any errors
