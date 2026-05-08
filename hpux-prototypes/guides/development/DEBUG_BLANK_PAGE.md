# Debug: Blank Page Issue

## Steps to Debug

1. **Open Browser Console** (F12 or Cmd+Option+I)
   - Look for error messages
   - Check for console.log statements

2. **Expected Console Output:**
   ```
   App component rendering
   🚀 Initializing prototype system...
   🔍 Discovering prototypes...
   📦 Found X prototype configuration files
   ✅ Prototype discovery complete!
   📦 Loaded X prototypes [list of IDs]
   AppContent render: { currentPrototype: undefined, isLoading: false, error: null }
   Rendering PrototypeLauncher
   ```

3. **If you see errors:**
   - Share the error messages
   - Look for "Module not found" or "Cannot find" errors

4. **If you see no console output at all:**
   - The JavaScript might not be loading
   - Check the Network tab for 404 errors

5. **If you see "Error Loading Prototypes":**
   - The prototype discovery is failing
   - Check the error message displayed

## Quick Checks

### Check if JavaScript is loading:
```bash
curl -s http://localhost:3000 | grep -i "script"
```

### Check if dev server is running:
```bash
ps aux | grep "webpack\|node" | grep -v grep
```

### Restart dev server:
```bash
npm run start:dev
```

## Common Causes

1. **Build failed** - Check terminal for build errors
2. **Webpack config issue** - Check webpack.dev.js
3. **Prototype discovery failing** - Check PrototypeRegistry.ts
4. **React mounting failing** - Check src/index.tsx
5. **Router basename issue** - Check App component

## Next Steps

Please check your browser console (F12) and tell me:
1. What errors you see (if any)
2. What console.log messages appear
3. If the page is completely blank or if there's any HTML structure

