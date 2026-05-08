# 👋 New Collaborator Guide

## Welcome! 🎉

This guide will help you set up your development environment and create your first isolated prototype in the HPUX Prototypes repository.

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Git installed
- ✅ Node.js 20+ installed
- ✅ npm or yarn installed
- ✅ A GitHub account
- ✅ Access to the repository (ask repository owner for access)

---

## 🚀 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/kuklas/HPUX-Prototypes.git

# Navigate into the directory
cd HPUX-Prototypes
```

---

## 📦 Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

This will install all required packages. It may take a few minutes.

---

## 🌿 Step 3: Set Up Your Feature Branch

Create your own feature branch to work in isolation:

```bash
# Switch to the main branch
git checkout ux-prototypes

# Pull the latest changes
git pull origin ux-prototypes

# Create your feature branch (use your name + feature)
git checkout -b your-name-feature

# Example branch names:
# - anna-aaq (for AAQ prototypes)
# - kevin-operatorhub (for OperatorHub work)
# - stefan-rbac (for RBAC prototypes)
# - stefan-cclm (for Cross Cluster Migration)
```

**Branch naming convention:**
- Use your first name + feature domain
- Use kebab-case (lowercase with hyphens)
- Examples: `anna-aaq`, `kevin-operatorhub`, `john-virtualization`

---

## 🎨 Step 4: Create Your First Prototype

### Option A: Copy the Template (Recommended)

```bash
# Copy the template directory
cp -r src/app/prototypes/_template src/app/prototypes/your-prototype-name

# Example:
# cp -r src/app/prototypes/_template src/app/prototypes/my-first-prototype
```

### Option B: Create from Scratch

Create a new directory:
```bash
mkdir -p src/app/prototypes/your-prototype-name
```

---

## ⚙️ Step 5: Configure Your Prototype

Edit the configuration file:

```bash
# Open the config file
code src/app/prototypes/your-prototype-name/prototype.config.ts
# or use your preferred editor
```

Update the following fields:

```typescript
export const config: PrototypeConfig = {
  // 1. Change the ID (use kebab-case, unique)
  id: 'your-prototype-id',
  
  // 2. Set your display name
  name: 'Your Prototype Name',
  
  // 3. Write a brief description
  description: 'What your prototype explores...',
  
  // 4. Add your information
  owner: {
    name: 'Your Name',
    slack: '@yourhandle',
    email: 'your.email@redhat.com'
  },
  
  // 5. Set status (start with 'draft' or 'in-progress')
  status: 'draft', // or 'in-progress'
  
  // 6. Define your persona
  persona: {
    name: 'Persona Name',
    role: 'Persona Role',
    organization: 'Organization Name'
  },
  
  // 7. Choose which perspectives to enable
  perspectives: ['core-platforms'], // or ['fleet-management'], ['fleet-virtualization']
  
  // 8. Add relevant tags
  tags: ['your-tag', 'another-tag'],
  
  // 9. Set dates
  createdAt: '2025-01-15', // Today's date
  updatedAt: '2025-01-15',
};
```

---

## 🛣️ Step 6: Set Up Routes

Edit the routes file:

```bash
code src/app/prototypes/your-prototype-name/routes.tsx
```

The template includes a basic structure. Update it with your routes:

```typescript
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/your-home-page" replace />,
    title: 'Home'
  },
  {
    path: '/your-home-page',
    element: <YourHomePage />,
    label: 'Home',
    title: 'Your Home Page',
    navigation: {
      group: '', // Empty for top-level
      order: 1
    }
  },
  // Add more routes as needed
];
```

---

## 📄 Step 7: Create Your Pages

Create your page components in the `pages/` directory:

```bash
# Create a new page
touch src/app/prototypes/your-prototype-name/pages/YourPage.tsx
```

Example page structure:

```typescript
import React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

export const YourPage: React.FC = () => {
  return (
    <PageSection>
      <Title headingLevel="h1" size="2xl">
        Your Page Title
      </Title>
      <Content>
        <p>Your page content goes here.</p>
      </Content>
    </PageSection>
  );
};
```

---

## 🧪 Step 8: Test Your Prototype

Start the development server:

```bash
npm start
```

Then:
1. Open http://localhost:3000
2. Find your prototype in the launcher
3. Click "Explore" to test it
4. Verify everything works as expected

---

## 💾 Step 9: Commit Your Work

```bash
# Stage your prototype files
git add src/app/prototypes/your-prototype-name/

# Commit with a descriptive message
git commit -m "Add [your-prototype-name] prototype"

# Push to your feature branch
git push origin your-name-feature
```

---

## 🔄 Step 10: Daily Workflow

### Start of Day
```bash
# Get latest changes from main branch
git checkout ux-prototypes
git pull origin ux-prototypes

# Switch back to your branch
git checkout your-name-feature

# Merge latest changes (if needed)
git merge ux-prototypes
```

### During Work
- ✅ **ONLY edit files in your prototype directory**: `src/app/prototypes/your-prototype-name/`
- ✅ Work on your prototype in isolation
- ✅ Test frequently: `npm start`
- ❌ **Avoid modifying shared files** unless absolutely necessary

### End of Day
```bash
# Commit your work
git add src/app/prototypes/your-prototype-name/
git commit -m "Update [feature description]"

# Push to remote
git push origin your-name-feature
```

---

## 🎯 Step 11: Create a Pull Request

When your prototype is ready:

1. **Push your branch:**
   ```bash
   git push origin your-name-feature
   ```

2. **Go to GitHub:**
   - Visit: https://github.com/kuklas/HPUX-Prototypes
   - Click "Pull requests" → "New pull request"
   - Select your branch: `your-name-feature`
   - Base branch: `ux-prototypes`

3. **Fill out the PR:**
   - Title: `Add [your-prototype-name] prototype`
   - Description: Explain what your prototype does
   - Add screenshots if helpful

4. **Request review** from the repository maintainer

---

## 📚 Important Concepts

### Prototype Isolation
- Each prototype lives in its own directory
- No conflicts with other prototypes
- Can work on multiple prototypes in the same branch

### Shared Components
- Use shared components from `src/app/shared/`
- Don't modify shared components unless necessary
- Copy components to your prototype if you need to customize

### Perspectives
- **Core platforms**: Single-cluster view (hub cluster)
- **Fleet management**: Multi-cluster management
- **Fleet virtualization**: Multi-cluster virtualization

### Navigation
- Routes define your prototype's navigation
- Use `navigation.group` to organize items
- Use `navigation.order` to control order

---

## 🆘 Troubleshooting

### Prototype doesn't appear in launcher
- ✅ Check `prototype.config.ts` has correct `id`
- ✅ Verify file is in `src/app/prototypes/your-prototype-name/`
- ✅ Restart dev server: `npm start`

### Type errors
- ✅ Run `npm run type-check` to see errors
- ✅ Check imports are correct
- ✅ Verify component types match

### Build errors
- ✅ Run `npm run build` to see errors
- ✅ Check console for runtime errors
- ✅ Verify all dependencies are installed

### Merge conflicts
- ✅ Pull latest: `git pull origin ux-prototypes`
- ✅ Merge: `git merge ux-prototypes`
- ✅ Resolve conflicts in your prototype files only

---

## 📖 Additional Resources

- **Template README**: `src/app/prototypes/_template/README.md`
- **Collaboration Guide**: `guides/collaboration/COLLABORATION_GUIDE.md`
- **Architecture Docs**: `guides/architecture/`

---

## ✅ Checklist for New Prototype

- [ ] Cloned repository
- [ ] Installed dependencies
- [ ] Created feature branch
- [ ] Copied template
- [ ] Updated `prototype.config.ts`
- [ ] Updated `routes.tsx`
- [ ] Created at least one page
- [ ] Tested in browser
- [ ] Committed changes
- [ ] Pushed to remote
- [ ] Created Pull Request (when ready)

---

## 🎉 You're Ready!

You now have everything you need to create isolated prototypes. Happy prototyping! 🚀

**Questions?** Ask in Slack or create an issue on GitHub.

