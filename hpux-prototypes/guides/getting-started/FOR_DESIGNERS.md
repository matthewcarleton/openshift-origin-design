# 🎨 For Designers: Build Your Own Prototypes!

## What Is This?

A system that lets **designers** create **interactive prototypes** for user research—**without writing code!**

Think of it like:
- 📋 **Template** you copy
- ✏️ **Form** you fill out  
- 🎨 **Components** you drag and drop (via copy-paste)
- 🚀 **Live prototype** you can test

---

## ⚡ 5-Minute Overview

### What You Can Do

✅ Create **your own prototype** (isolated from others)  
✅ Build **clickable interfaces** using ready-made components  
✅ Test **different design variations**  
✅ Share with **research participants**  
✅ Work on **multiple prototypes** simultaneously  

### What You DON'T Need

❌ Programming experience  
❌ Understanding of React/TypeScript  
❌ Knowledge of git workflows  
❌ Server setup skills  

**If you can edit a text file and copy-paste, you can do this!**

---

## 🚀 Quick Start (In Pictures)

### Step 1: Copy the Template

```
src/app/prototypes/
├─ _template/          ← Copy this folder
├─ empty-states/       ← Rename to your prototype name
```

### Step 2: Fill Out the Config

Open `prototype.config.ts` and change:

```typescript
{
  id: 'empty-states',              ← Your prototype ID
  name: 'Empty State Exploration', ← Display name
  owner: {
    name: 'Jane Designer',         ← Your name
    slack: '@jane'                 ← Your Slack
  },
  persona: {
    name: 'Sarah Admin',           ← Who is the user?
    role: 'Administrator'          ← What's their role?
  }
}
```

**That's it for setup!**

### Step 3: Build Your UI

Open `pages/HomePage.tsx` and use components like LEGO blocks:

```typescript
// A button
<Button variant="primary">Click Me</Button>

// A card
<Card>
  <CardTitle>My Card</CardTitle>
  <CardBody>Card content here</CardBody>
</Card>

// An empty state
<EmptyState>
  <EmptyStateHeader titleText="No items found" />
  <EmptyStateBody>Create your first item to get started.</EmptyStateBody>
  <Button>Create Item</Button>
</EmptyState>
```

### Step 4: See It Live

Run in Terminal:
```bash
npm run start:dev
```

Open browser → `http://localhost:8080` → Select your prototype!

**Changes you make automatically refresh the page!**

---

## 🎨 Designer Superpowers

### 1. Test Multiple Variations

Create different pages for each variation:

```
pages/
├─ Variation1.tsx    ← Option A
├─ Variation2.tsx    ← Option B  
├─ Variation3.tsx    ← Option C
```

Switch between them in research sessions!

### 2. Use Real Components

Don't design in Figma then hand off—**build with the real components!**

- Buttons look like real buttons
- Forms work like real forms
- Interactions feel real

Users get a more authentic experience.

### 3. Iterate Fast

1. Make a change
2. Save file (Cmd+S)
3. Browser refreshes automatically
4. Test immediately

**No build process, no deploy, no waiting.**

### 4. Work Independently

Your prototype is **100% isolated**:

- Can't break others' prototypes
- No conflicts when saving
- Work at your own pace

### 5. Archive When Done

Change one line:
```typescript
status: 'archived'
```

Your prototype stays accessible for reference but moves out of the way.

---

## 📦 Available Components

All components from [PatternFly](https://www.patternfly.org/):

| Component | Use For |
|-----------|---------|
| **Button** | Actions |
| **Card** | Content grouping |
| **Empty State** | No data scenarios |
| **Alert/Banner** | Notifications |
| **Modal** | Dialogs |
| **Form** | Data input |
| **Table** | Data lists |
| **Tabs** | Content organization |
| **Wizard** | Multi-step flows |
| **Toolbar** | Page actions |

**Over 100+ components ready to use!**

---

## 🎯 Real Designer Workflows

### Scenario 1: Testing Empty States

**Research question:** Which empty state is more welcoming?

```typescript
// Variation A: Encouraging
<EmptyState>
  <EmptyStateHeader titleText="Welcome! Let's get started" />
  <EmptyStateBody>
    You haven't created any clusters yet. 
    Create your first cluster in just a few clicks.
  </EmptyStateBody>
  <Button variant="primary">Create Cluster</Button>
</EmptyState>

// Variation B: Informative
<EmptyState>
  <EmptyStateHeader titleText="No clusters" />
  <EmptyStateBody>
    Clusters allow you to manage multiple OpenShift instances.
  </EmptyStateBody>
  <Button variant="secondary">Learn More</Button>
  <Button variant="primary">Create Cluster</Button>
</EmptyState>
```

Create two pages, test both, see what works!

### Scenario 2: Testing Button Placement

**Research question:** Where should the primary action be?

Create variations with buttons in different locations:
- Top-right of page
- Bottom of form
- Floating action button
- Inline with content

Test which users find most easily.

### Scenario 3: Testing Information Hierarchy

**Research question:** How should we organize cluster details?

Create variations with:
- Tabs vs. single page
- Cards vs. lists
- Collapsed vs. expanded sections

See what users understand best.

---

## 🔄 Your Workflow

```
1. Get an idea
   ↓
2. Copy template (2 min)
   ↓
3. Build variation 1 (30 min)
   ↓
4. Test with users
   ↓
5. Learn something
   ↓
6. Build variation 2 (20 min)
   ↓
7. Test again
   ↓
8. Iterate until confident
   ↓
9. Document findings
   ↓
10. Archive prototype
```

**Fast iteration = Better designs**

---

## 💡 Designer Tips

### Use Real Content

❌ "Lorem ipsum dolor sit amet"  
✅ "No clusters have been created yet. Create your first cluster to manage your OpenShift workloads."

### Test in Context

Don't just show a component—build the whole page flow:
1. Where do users start?
2. What do they see first?
3. What actions are available?
4. Where do they go next?

### Collaborate with Developers

- Ask them for help setting up
- They can add complex interactions
- They can connect to real data (later)
- They know which components exist

### Document Everything

Your `README.md` should capture:
- What you're testing
- Different variations
- Research findings
- Recommendations

**Your prototype becomes documentation!**

---

## 🆘 Common Issues (Solved!)

### "I don't know React!"

**No problem!** Think of it like HTML with angle brackets:

```typescript
<Button>Text</Button>         ← Like <button>Text</button>
<Title>Title</Title>          ← Like <h1>Title</h1>
<Card>Content</Card>          ← Like <div>Content</div>
```

Copy examples and change the text!

### "What if I break something?"

**You can't!** Your prototype is isolated. Even if you delete everything, you can just copy the template again.

Press Cmd+Z (undo) if you mess up.

### "The page doesn't update!"

Make sure you **saved the file** (Cmd+S or Ctrl+S).

If still stuck, refresh the browser (Cmd+R or Ctrl+R).

### "I want a component that doesn't exist!"

1. Check [PatternFly components](https://www.patternfly.org/)
2. Ask your dev team
3. Combine existing components creatively

---

## 📚 Learn More

### Full Designer Guide

**[Read: DESIGNERS_GUIDE.md](./DESIGNERS_GUIDE.md)** (20 min)

Complete step-by-step tutorial with:
- Setup instructions
- Component examples
- Common tasks
- Troubleshooting

### PatternFly Resources

- **Components:** https://www.patternfly.org/components/all-components
- **Patterns:** https://www.patternfly.org/patterns/about-patterns
- **Examples:** Browse existing prototypes in `src/app/prototypes/`

---

## ✅ Ready to Start?

### Right Now (30 minutes)

1. **Read [DESIGNERS_GUIDE.md](./DESIGNERS_GUIDE.md)** (20 min)
2. **Copy the template** (2 min)
3. **Edit the config** (3 min)
4. **Add some components** (5 min)
5. **See it live!**

### This Week

1. Build a simple prototype
2. Test with 3-5 users
3. Iterate based on feedback
4. Share findings with team

---

## 🎉 Why This Is Awesome

### Before (Traditional Process)

```
Design in Figma (2 days)
    ↓
Review with team (1 day)
    ↓
Hand off to dev (wait 1 week)
    ↓
Dev builds it (1 week)
    ↓
Test with users (finally!)
    ↓
Need to change something?
    ↓
Back to step 1... 😰
```

**Total: 3+ weeks per iteration**

### After (With This System)

```
Build prototype (4 hours)
    ↓
Test with users (same day!)
    ↓
Learn something
    ↓
Tweak prototype (1 hour)
    ↓
Test again
    ↓
Iterate until right
```

**Total: 2-3 days for multiple iterations**

---

## 📞 Get Help

### Ask Your Dev Team

- Initial setup
- Complex interactions
- Component questions
- Git issues

### Self-Service Resources

- **Designer guide:** [DESIGNERS_GUIDE.md](./DESIGNERS_GUIDE.md)
- **PatternFly docs:** https://www.patternfly.org/
- **Example prototypes:** Look in `src/app/prototypes/`
- **Browser console:** Press F12 to see error messages

---

## 🚀 Let's Go!

You're ready to:

- ✅ Create prototypes independently
- ✅ Test designs with real components
- ✅ Iterate quickly based on feedback
- ✅ Collaborate with your team
- ✅ Document findings

**No code required. Just design thinking and copy-paste!**

---

**Start here: [DESIGNERS_GUIDE.md](./DESIGNERS_GUIDE.md)** 🎨

---

**Questions?** Ask your dev team or check the [full documentation](./START_HERE.md)!

**Made with ❤️ for designers who want to move fast and test real interactions**

