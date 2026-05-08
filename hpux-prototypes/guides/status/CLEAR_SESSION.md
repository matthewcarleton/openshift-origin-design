# Clear Browser Session

To land on the launcher page, you need to clear the saved session:

## Option 1: Clear in Browser Console
1. Open browser console (F12)
2. Type: `sessionStorage.clear()`
3. Press Enter
4. Refresh the page

## Option 2: Use Private/Incognito Window
1. Open a new private/incognito window
2. Go to http://localhost:3000
3. You'll start fresh on the launcher

## Option 3: Clear All Site Data
1. Open DevTools (F12)
2. Go to Application tab
3. Find "Storage" in left sidebar
4. Click "Clear site data"
5. Refresh

---

After clearing, you should see:
- ✅ Prototype Launcher page
- ✅ 4 top-level prototype groups
- ✅ Expandable parents showing children

