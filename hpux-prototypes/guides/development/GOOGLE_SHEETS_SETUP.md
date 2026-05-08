# Google Sheets Feedback Integration Setup Guide

Follow these steps to connect your feedback form to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "ACM Prototype Feedback"
4. In the first row, add these headers:
   - Column A: **Timestamp**
   - Column B: **Name**
   - Column C: **Email**
   - Column D: **Feedback**
   - Column E: **Page**
   - Column F: **Full URL**

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Add a new row with the feedback data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.feedback,
      data.page,
      data.url
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Feedback submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Feedback API is running');
}
```

4. Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
5. Name your project (e.g., "Feedback Collector")

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Feedback Form Integration" (or any name)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (important!)
5. Click **Deploy**
6. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Update the Code

1. Open the file: `src/app/AppLayout/AppLayout.tsx`
2. Find this line (around line 82):
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your actual Web App URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file
5. Rebuild and redeploy:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

## Step 5: Test It!

1. Go to your GitHub Pages site
2. Click the **Feedback** button
3. Fill out and submit the form
4. Check your Google Sheet - the feedback should appear!

## 📊 Viewing Your Feedback

- All feedback will appear in your Google Sheet in real-time
- Each submission creates a new row
- You can sort, filter, and analyze the data in Google Sheets
- You can share the sheet with your team
- You can export to Excel, CSV, etc.

## 🔧 Troubleshooting

**If feedback doesn't appear:**

1. Check the browser console for errors (F12)
2. Make sure the Web App is deployed as "Anyone" can access
3. Verify the URL is copied correctly (no extra spaces)
4. Try redeploying the Web App (Deploy → Manage deployments → Edit → Deploy)

**To update the script later:**

1. Make changes in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the pencil icon ✏️ to edit
4. Select "New version"
5. Click **Deploy**

## 🎉 Done!

Your feedback form is now connected to Google Sheets and will collect responses from anyone who visits your prototype!

