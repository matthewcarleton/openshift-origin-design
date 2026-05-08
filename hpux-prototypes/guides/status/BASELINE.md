# 🎯 BASELINE - Clusters Page Layout

**Date:** January 2025  
**Status:** ✅ COMPLETE - Perfect match to Red Hat OpenShift screenshot

## 📋 Layout Structure

### Header Section (White Background)
- **"Clusters" title** at the top
- **Tabs**: "Cluster list", "Cluster sets", "Cluster pools", "Discovered clusters"
- **White background** with 24px padding
- **16px spacing** between title and tabs
- **Border bottom** for visual separation

### Content Area (Grey Background)
- **Full grey background** (`#f5f5f5`) covering entire content area
- **White card** sitting on top of grey background
- **16px padding** around the white card
- **Tab content** rendered in grey area (not in header)

## 🏗️ Technical Implementation

### File Structure
```
src/app/navigation/infrastructure/ClustersPage.tsx
src/app/Clusters/Clusters.tsx
src/app/app.css (clusters-page-container styles)
```

### Key CSS Classes
```css
.clusters-page-container {
  background-color: #f5f5f5 !important;
  padding: 0 !important;
  min-height: 100vh !important;
}

.clusters-page-container .page-header-section {
  background-color: #ffffff !important;
  padding: 24px !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

.clusters-page-container .page-content-section {
  background-color: #f5f5f5 !important;
  padding: 16px !important;
}
```

### Component Structure
```tsx
// ClustersPage.tsx
<div className="clusters-page-container">
  <Clusters />
</div>

// Clusters.tsx
<>
  <div className="page-header-section">
    <Title>Clusters</Title>
    <Tabs>...</Tabs>
  </div>
  
  <div className="page-content-section">
    {activeTabKey === 0 && <ClusterListTab />}
    // ... other tabs
  </div>
</>
```

## ✅ Features Working
- [x] White header with title and tabs
- [x] Grey content area below header
- [x] White card with proper padding on grey background
- [x] Tab switching functionality
- [x] Table content inside white card
- [x] Toolbar with search and filters
- [x] Pagination
- [x] Responsive layout

## 🎨 Visual Match
This implementation perfectly matches the Red Hat OpenShift Service on AWS screenshot with:
- Clean white header section
- Grey content area
- White card with 16px padding
- Proper spacing and typography
- Professional Red Hat styling

## 📝 Notes
- This is the working baseline for the Clusters page layout
- All styling uses `!important` to override PatternFly defaults
- Layout is responsive and matches the original design exactly
- Ready for production use

---
**Created:** January 2025  
**Status:** ✅ BASELINE SAVED
