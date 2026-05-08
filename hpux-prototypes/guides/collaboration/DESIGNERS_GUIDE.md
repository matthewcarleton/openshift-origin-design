# 🎨 Designer's Guide to Creating Prototypes

## Welcome Designers! 👋

This guide helps **designers** (not developers) create their own interactive prototypes using this system. No coding experience required—just follow the steps!

---

## 🎯 What Can You Do?

With this system, you can:

- ✅ Create your own **isolated prototype** without affecting others
- ✅ **Copy and modify** existing UI components
- ✅ Build **clickable prototypes** for user research
- ✅ Test different **interaction patterns**
- ✅ Work on **multiple prototypes** at the same time
- ✅ **Archive** prototypes when research is complete

**No programming skills needed!** If you can edit a text file, you can create a prototype.

---

## 🚀 Quick Start (30 Minutes)

### Step 1: Set Up Your Environment (5 min)

**You'll need:**
1. **Visual Studio Code** (text editor) - [Download here](https://code.visualstudio.com/)
2. **Node.js** installed - Ask your dev team or [download here](https://nodejs.org/)
3. Access to this repository

**First-time setup:**
```bash
# Open Terminal (Mac) or Command Prompt (Windows)
# Navigate to the project folder
cd "path/to/HPUX Prototypes"

# Install dependencies (only needed once)
npm install
```

---

### Step 2: Copy the Template (2 min)

Think of a name for your prototype (use lowercase and dashes, like `my-awesome-prototype`).

**In Visual Studio Code:**

1. Open the project folder
2. Navigate to `src/app/prototypes/`
3. **Right-click** on the `_template` folder
4. Select **"Copy"**
5. **Right-click** in the `prototypes/` folder
6. Select **"Paste"**
7. **Rename** the copied folder to your prototype name

**Example:** `src/app/prototypes/empty-state-exploration/`

---

### Step 3: Configure Your Prototype (5 min)

Open the file: `src/app/prototypes/your-prototype-name/prototype.config.ts`

**Edit these parts** (they're clearly marked with `←` arrows):

```typescript
export const config = {
  // Your prototype's unique ID (use dashes, no spaces)
  id: 'empty-state-exploration',  // ← CHANGE THIS
  
  // Display name (shown in the launcher)
  name: 'Empty State Design Exploration',  // ← CHANGE THIS
  
  // What's this prototype for?
  description: 'Testing different empty state patterns for the clusters page',  // ← CHANGE THIS
  
  // Your info
  owner: {
    name: 'Jane Designer',  // ← YOUR NAME
    slack: '@jane',  // ← YOUR SLACK
    email: 'jane@redhat.com'  // ← YOUR EMAIL
  },
  
  // Start with version 0.1.0
  version: '0.1.0',
  
  // Status: Use 'draft' while you're building
  status: 'draft',
  
  // Who is the user in your scenario?
  persona: {
    name: 'Sarah Admin',  // ← WHO IS THE USER?
    role: 'Cluster Administrator',  // ← WHAT'S THEIR ROLE?
    organization: 'Tech Company'  // ← OPTIONAL
  },
  
  // What task should users try to complete?
  task: {
    title: 'Your Task',
    description: 'Describe what you want test participants to do',  // ← CHANGE THIS
  },
  
  // Which view? Usually 'fleet-management' or 'core-platforms'
  perspectives: ['fleet-management'],  // ← PICK ONE
  
  // Tags to help find your prototype later
  tags: ['empty-states', 'exploration', 'clusters'],  // ← ADD RELEVANT TAGS
  
  // Today's date (YYYY-MM-DD)
  createdAt: '2024-11-06',  // ← TODAY'S DATE
  updatedAt: '2024-11-06'
};
```

**Save the file** (Cmd+S on Mac, Ctrl+S on Windows)

---

### Step 4: Start Building Your Prototype (15 min)

**Open:** `src/app/prototypes/your-prototype-name/pages/HomePage.tsx`

This is where you build your UI. You can:

#### Option A: Start from Scratch (Blank Canvas)

Replace everything in the file with this simple template:

```typescript
import React from 'react';
import {
  PageSection,
  Title,
  Content,
  Button,
  Card,
  CardBody,
} from '@patternfly/react-core';

export const HomePage: React.FC = () => {
  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          My Prototype Page
        </Title>
        <Content component="p">
          Description of what this page does.
        </Content>
      </PageSection>

      <PageSection>
        <Card>
          <CardBody>
            {/* Put your content here! */}
            <p>This is where your design goes.</p>
            <Button variant="primary">Click Me</Button>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};
```

#### Option B: Copy from Another Prototype

1. Browse `src/app/prototypes/` to find existing prototypes
2. Look at their `pages/` folders
3. Copy components you like
4. Paste into your prototype
5. Modify the text and styling

**Example:** Want a table? Look at `use-case-1/Clusters/Clusters.tsx` and copy the table code.

---

### Step 5: See Your Prototype Live! (3 min)

**In Terminal:**

```bash
# Start the development server
npm run start:dev
```

**In your browser:**

1. Open `http://localhost:8080`
2. You'll see the **Prototype Launcher**
3. Look in the **"Draft"** tab
4. Find your prototype
5. **Click it** to open!

🎉 **Your prototype is now running!**

**The page will automatically refresh when you make changes!**

---

## 🎨 Designer-Friendly Editing

### What You Can Safely Edit

✅ **Text and Labels**
```typescript
<Title>Change this text</Title>
<Button>Change button text</Button>
```

✅ **Colors** (using PatternFly color names)
```typescript
<Label color="blue">Status</Label>
<Label color="green">Active</Label>
<Label color="red">Error</Label>
```

✅ **Spacing** (using PatternFly spacing tokens)
```typescript
style={{ 
  marginTop: 'var(--pf-t--global--spacer--md)',
  padding: 'var(--pf-t--global--spacer--lg)'
}}
```

✅ **Component Properties**
```typescript
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="link">Link Button</Button>
```

---

### PatternFly Components You Can Use

**Copy-paste these into your prototype:**

#### Button
```typescript
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="danger">Delete</Button>
<Button variant="link">Learn More</Button>
```

#### Card
```typescript
<Card>
  <CardTitle>Card Title</CardTitle>
  <CardBody>
    Card content goes here.
  </CardBody>
</Card>
```

#### Empty State
```typescript
import { 
  EmptyState, 
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateActions 
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

<EmptyState>
  <EmptyStateHeader
    titleText="No items found"
    icon={<EmptyStateIcon icon={CubesIcon} />}
    headingLevel="h2"
  />
  <EmptyStateBody>
    There are currently no items to display.
  </EmptyStateBody>
  <EmptyStateActions>
    <Button variant="primary">Create Item</Button>
  </EmptyStateActions>
</EmptyState>
```

#### Alert/Banner
```typescript
<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert variant="info" title="Information">
  This is an informational message.
</Alert>

<Alert variant="warning" title="Warning">
  Please review this before continuing.
</Alert>

<Alert variant="danger" title="Error">
  Something went wrong.
</Alert>
```

#### Modal (Dialog)
```typescript
import { Modal, ModalVariant } from '@patternfly/react-core';

const [isOpen, setIsOpen] = React.useState(false);

<Modal
  variant={ModalVariant.small}
  title="Delete Item?"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  Are you sure you want to delete this item?
</Modal>

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
```

**More components:** Browse [PatternFly Components](https://www.patternfly.org/components/all-components)

---

## 🗂️ Adding More Pages

Want multiple pages in your prototype?

### 1. Create a New Page

Create a new file: `src/app/prototypes/your-prototype/pages/SettingsPage.tsx`

```typescript
import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

export const SettingsPage: React.FC = () => {
  return (
    <PageSection>
      <Title headingLevel="h1">Settings</Title>
      {/* Your settings UI here */}
    </PageSection>
  );
};
```

### 2. Add It to Routes

Open: `src/app/prototypes/your-prototype/routes.tsx`

Add your new page:

```typescript
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';  // ← ADD THIS

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home',  // Shown in navigation
    title: 'Home'
  },
  {
    path: '/settings',  // ← URL path
    element: <SettingsPage />,  // ← Your component
    label: 'Settings',  // ← Shows in nav sidebar
    title: 'Settings'
  }
];
```

**Your navigation will automatically update!**

---

## 🎯 Common Designer Tasks

### Task 1: Testing Empty States

**Goal:** Show different empty state designs

```typescript
// Option 1: Welcoming empty state
<EmptyState>
  <EmptyStateHeader
    titleText="Welcome! Let's get started"
    icon={<EmptyStateIcon icon={PlusCircleIcon} />}
  />
  <EmptyStateBody>
    You haven't created any clusters yet. 
    Create your first cluster to get started.
  </EmptyStateBody>
  <EmptyStateActions>
    <Button variant="primary">Create Cluster</Button>
  </EmptyStateActions>
</EmptyState>

// Option 2: Error empty state
<EmptyState>
  <EmptyStateHeader
    titleText="No clusters found"
    icon={<EmptyStateIcon icon={SearchIcon} />}
  />
  <EmptyStateBody>
    We couldn't find any clusters matching your filters.
    Try adjusting your search criteria.
  </EmptyStateBody>
  <EmptyStateActions>
    <Button variant="link">Clear filters</Button>
  </EmptyStateActions>
</EmptyState>
```

### Task 2: Testing Button Placement

```typescript
// Top-right actions
<PageSection variant="light">
  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
    <Title headingLevel="h1">Clusters</Title>
    <FlexItem>
      <Button variant="primary">Create Cluster</Button>
    </FlexItem>
  </Flex>
</PageSection>

// Bottom-right actions
<PageSection>
  <Card>
    <CardBody>
      {/* Content */}
    </CardBody>
    <CardFooter>
      <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
        <Button variant="link">Cancel</Button>
        <Button variant="primary">Save</Button>
      </Flex>
    </CardFooter>
  </Card>
</PageSection>
```

### Task 3: Testing Form Layouts

```typescript
import { Form, FormGroup, TextInput } from '@patternfly/react-core';

<Form>
  <FormGroup
    label="Cluster Name"
    isRequired
    fieldId="cluster-name"
  >
    <TextInput
      isRequired
      type="text"
      id="cluster-name"
      name="cluster-name"
    />
  </FormGroup>
  
  <FormGroup
    label="Description"
    fieldId="description"
  >
    <TextInput
      type="text"
      id="description"
      name="description"
    />
  </FormGroup>
  
  <ActionGroup>
    <Button variant="primary">Create</Button>
    <Button variant="link">Cancel</Button>
  </ActionGroup>
</Form>
```

### Task 4: Testing Card Layouts

```typescript
<Grid hasGutter>
  <GridItem span={4}>
    <Card>
      <CardTitle>Card 1</CardTitle>
      <CardBody>Content</CardBody>
    </Card>
  </GridItem>
  <GridItem span={4}>
    <Card>
      <CardTitle>Card 2</CardTitle>
      <CardBody>Content</CardBody>
    </Card>
  </GridItem>
  <GridItem span={4}>
    <Card>
      <CardTitle>Card 3</CardTitle>
      <CardBody>Content</CardBody>
    </Card>
  </GridItem>
</Grid>
```

---

## 💡 Designer Tips

### Tip 1: Use Real Content

Replace placeholder text with realistic content:

❌ **Don't use:** "Lorem ipsum dolor sit amet"  
✅ **Do use:** "No clusters have been created yet. Create your first cluster to get started with Red Hat Advanced Cluster Management."

### Tip 2: Test Multiple States

Create different versions of your page:

- Empty state (no data)
- Loading state
- Error state
- Success state with data

### Tip 3: Work Iteratively

1. Start simple (basic layout)
2. Test with users
3. Refine based on feedback
4. Add polish

### Tip 4: Ask for Help!

**Stuck on something?**
- Ask a developer on your team
- Check [PatternFly documentation](https://www.patternfly.org/)
- Look at other prototypes for examples

### Tip 5: Document Your Decisions

Edit your prototype's `README.md` to explain:
- What you're testing
- Different variations
- Research findings

---

## 🔄 Iterating on Your Prototype

### Making Changes

1. **Edit your files** in Visual Studio Code
2. **Save** (Cmd+S / Ctrl+S)
3. **Browser refreshes automatically!**

No need to restart anything!

### Testing Different Variations

Create multiple pages for different variations:

```
pages/
├─ HomePage.tsx
├─ Variation1.tsx
├─ Variation2.tsx
└─ Variation3.tsx
```

Switch between them in routes:

```typescript
export const routes = [
  { path: '/', element: <Variation1 />, label: 'Variation 1' },
  { path: '/v2', element: <Variation2 />, label: 'Variation 2' },
  { path: '/v3', element: <Variation3 />, label: 'Variation 3' },
];
```

---

## 📤 Sharing Your Prototype

### With Your Team

**Option 1: Share Running Prototype**
1. Keep `npm run start:dev` running
2. Share the URL: `http://localhost:8080`
3. They select your prototype from the launcher

**Option 2: Commit to Git**
```bash
# Add your prototype
git add src/app/prototypes/your-prototype-name

# Save it
git commit -m "Add [your prototype name] for testing [feature]"

# Push it
git push
```

Now teammates can pull and test your prototype!

### For User Research

1. Update status to `'active'` in `prototype.config.ts`
2. Your prototype moves to the "Active" tab
3. Share the launcher URL with participants
4. They select your prototype

---

## 🗃️ When You're Done

### Archive Your Prototype

When research is complete:

1. Open `prototype.config.ts`
2. Change status:
   ```typescript
   status: 'archived',  // ← Change from 'active' to 'archived'
   ```
3. Add your findings to `README.md`

Your prototype stays accessible in the "Archived" tab!

---

## ❓ Common Questions

**Q: Do I need to know React?**  
A: Nope! You can copy-paste examples and modify them. Think of it like HTML templates.

**Q: What if I break something?**  
A: Your prototype is isolated—you can't break others' prototypes! Just undo your changes or ask for help.

**Q: Can I use Figma designs?**  
A: Yes! Translate your Figma designs into PatternFly components. PatternFly has most components you'd design.

**Q: How do I add images?**  
A: Put images in `src/app/prototypes/your-prototype/assets/` and import them:
```typescript
import myImage from '../assets/my-image.png';

<img src={myImage} alt="Description" />
```

**Q: Can I add custom CSS?**  
A: Yes! Create `styles.css` in your prototype directory and import it:
```typescript
import './styles.css';
```

**Q: Where do I find component examples?**  
A: Three places:
1. [PatternFly Documentation](https://www.patternfly.org/)
2. Other prototypes in `src/app/prototypes/`
3. Ask your dev team!

**Q: How do I stop the server?**  
A: In Terminal, press `Ctrl+C`

**Q: My changes aren't showing?**  
A: Make sure you saved the file (Cmd+S / Ctrl+S). If still not working, refresh the browser.

---

## 🎓 Learning Resources

### PatternFly (UI Framework)

- **Website:** https://www.patternfly.org/
- **Components:** https://www.patternfly.org/components/all-components
- **Patterns:** https://www.patternfly.org/patterns/about-patterns

### Visual Studio Code

- **Keyboard shortcuts:** Cmd+P (find files), Cmd+Shift+F (search all files)
- **Extensions:** Install "Prettier" for auto-formatting

### Git Basics (Optional)

If you want to save your work:
```bash
git add src/app/prototypes/your-prototype
git commit -m "Describe what you changed"
git push
```

---

## 🆘 Getting Help

### When You're Stuck

1. **Check other prototypes** - Look for similar examples
2. **Search PatternFly docs** - Most components have examples
3. **Ask your team** - Share your screen, explain what you want
4. **Check browser console** - Red errors tell you what's wrong (press F12)

### Ask a Developer If...

- ❓ You need data from an API
- ❓ You need complex interactions
- ❓ You need custom functionality
- ❓ Something breaks and you can't fix it

---

## ✅ Checklist for New Prototype

- [ ] Copied `_template` folder
- [ ] Renamed to my prototype name
- [ ] Edited `prototype.config.ts` with my info
- [ ] Built my first page
- [ ] Started dev server (`npm run start:dev`)
- [ ] Tested in browser
- [ ] Made changes and saw them update
- [ ] Documented what I'm testing in `README.md`

---

## 🎉 You're Ready!

You now know how to:
- ✅ Create your own prototype
- ✅ Build UI with PatternFly components
- ✅ Add multiple pages
- ✅ Test different variations
- ✅ Share with your team
- ✅ Archive when done

**Happy prototyping! 🚀**

---

## 📞 Need Help?

- **Slack:** Ask in your team channel
- **Developer Contact:** [Your dev team's contact]
- **This Guide:** Keep this file open as reference!

---

**Remember:** You can't break anything! Your prototype is completely isolated. Experiment freely! 🎨

