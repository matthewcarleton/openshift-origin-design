# 🤝 Designer Collaboration Guide

## For 20+ Designers Working Together

This guide shows how **multiple designers** across **different locations** can work on the **same repository** without breaking each other's prototypes.

---

## 🎯 The Core Principle

### Each Designer = Own Isolated Directory

```
src/app/prototypes/
├─ sarah-empty-states/       ← Sarah works here
├─ mike-button-placement/    ← Mike works here
├─ anna-form-validation/     ← Anna works here
├─ kevin-navigation-test/    ← Kevin works here
└─ jane-onboarding-flow/     ← Jane works here
```

**Rule:** You only edit files in **your prototype directory**.

**Result:** No conflicts! Sarah can't accidentally break Mike's prototype.

---

## 🚀 How It Works (Simple Version)

### Step 1: Each Designer Creates Their Own Prototype

**Sarah (in San Francisco):**
```bash
cd src/app/prototypes
cp -r _template sarah-empty-states
# Edits only files in sarah-empty-states/
```

**Mike (in London):**
```bash
cd src/app/prototypes
cp -r _template mike-button-placement
# Edits only files in mike-button-placement/
```

**Anna (in Berlin):**
```bash
cd src/app/prototypes
cp -r _template anna-form-validation
# Edits only files in anna-form-validation/
```

### Step 2: Everyone Works Independently

- Sarah edits `sarah-empty-states/pages/HomePage.tsx`
- Mike edits `mike-button-placement/pages/HomePage.tsx`
- Anna edits `anna-form-validation/pages/HomePage.tsx`

**Different files = Zero conflicts!**

### Step 3: Everyone Saves Their Work (Git)

**Sarah:**
```bash
git add src/app/prototypes/sarah-empty-states
git commit -m "Add empty state variations"
git push
```

**Mike (at the same time):**
```bash
git add src/app/prototypes/mike-button-placement
git commit -m "Test button placements"
git push
```

**No conflicts!** They edited different directories.

---

## 📋 Complete Workflow for Remote Teams

### Monday: Kick Off Research

**Research lead posts in Slack:**
```
This week's prototypes:
- Sarah: Empty states exploration
- Mike: Button placement study
- Anna: Form validation patterns
- Kevin: Navigation structure
- Jane: Onboarding flow

Everyone: Create your prototype by EOD
```

### Monday Afternoon: Everyone Creates Prototypes

**Each designer (in parallel):**

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Copy template:**
   ```bash
   cd src/app/prototypes
   cp -r _template your-name-your-topic
   ```

3. **Edit config file:**
   ```typescript
   // prototype.config.ts
   export const config = {
     id: 'sarah-empty-states',
     name: 'Empty State Exploration',
     owner: {
       name: 'Sarah Chen',
       slack: '@sarah',
       email: 'sarah@company.com'
     },
     // ... rest of config
   };
   ```

4. **Build your prototype** in your directory

5. **Save and push:**
   ```bash
   git add src/app/prototypes/sarah-empty-states
   git commit -m "Add empty states prototype"
   git push
   ```

### Tuesday-Thursday: Everyone Iterates

**Each designer works independently:**

- Edit only files in their own directory
- Test locally: `npm run start:dev`
- Commit changes regularly
- Push to GitHub

**No coordination needed!** Work at your own pace.

### Friday: Everyone Shares

**Pull all changes:**
```bash
git pull origin main
```

**Run locally:**
```bash
npm run start:dev
```

**You see ALL prototypes** in the launcher:
- Sarah's empty states prototype
- Mike's button placement prototype
- Anna's form validation prototype
- Kevin's navigation prototype
- Jane's onboarding prototype

**Click any to test it!**

---

## 🔐 The Safety Mechanisms

### 1. Directory Isolation

```
Your directory structure:
src/app/prototypes/sarah-empty-states/
├─ prototype.config.ts     ← ONLY YOU EDIT
├─ README.md               ← ONLY YOU EDIT
├─ routes.tsx              ← ONLY YOU EDIT
├─ pages/                  ← ONLY YOU EDIT
├─ components/             ← ONLY YOU EDIT
└─ data/                   ← ONLY YOU EDIT
```

**No one else touches these files!**

### 2. Git Branch Strategy (Optional)

Each designer can use their own branch:

```bash
# Sarah creates her branch
git checkout -b prototypes/sarah/empty-states

# Works on her prototype
# ... makes changes ...

# Pushes her branch
git push origin prototypes/sarah/empty-states

# Merges when ready (no conflicts!)
```

### 3. Naming Convention

Use your name in the directory:

✅ Good:
- `sarah-empty-states`
- `mike-button-placement`
- `anna-form-validation`

❌ Bad (might conflict):
- `empty-states` (who's is this?)
- `prototype-1` (vague)
- `test` (everyone might use this name)

---

## 🎨 Real-World Scenario: 20 Designers

### Team Structure

**Design Team (20 people):**
- 5 in San Francisco
- 5 in London
- 5 in Berlin
- 5 in Remote locations

**Research Projects:**
- 8 active prototypes this week
- 6 archived from last week
- 6 planned for next week

### Week 1: Setup

**Monday - Onboarding (1 hour):**
- Dev team runs workshop
- Each designer creates test prototype
- Practices git workflow
- Confirms they can see each other's prototypes

**Rest of Week:**
- Designers build real prototypes
- Dev team available for questions
- Daily standup: Share progress

### Week 2+: Full Speed

**Daily Pattern:**

**Morning:**
```bash
# Pull latest updates
git pull origin main

# See what's new
# Other designers' prototypes now appear in your local launcher
```

**During Day:**
```bash
# Work in your prototype directory
# Save frequently (Cmd+S)
# Test locally
# Commit when you reach a good stopping point

git add src/app/prototypes/your-prototype
git commit -m "Updated button styles"
```

**End of Day:**
```bash
# Push your work
git push

# Your work is now available to the team
```

**Weekly Sync (Friday):**
- Demo prototypes to each other
- Share findings
- Discuss patterns
- Archive completed prototypes

---

## 🚫 What NEVER Causes Conflicts

### Safe Activities (Do Freely!)

✅ **Creating your prototype:**
```bash
cp -r _template sarah-new-prototype
```
**Why safe:** New directory, doesn't touch others

✅ **Editing your files:**
```
sarah-prototype/pages/HomePage.tsx
sarah-prototype/prototype.config.ts
```
**Why safe:** Only you edit these files

✅ **Adding pages to your prototype:**
```bash
# Create new file in YOUR directory
touch sarah-prototype/pages/SettingsPage.tsx
```
**Why safe:** New file in your directory

✅ **Pushing your work:**
```bash
git push
```
**Why safe:** Different directory = no conflicts

✅ **Pulling others' work:**
```bash
git pull
```
**Why safe:** Their directories don't interfere with yours

---

## ⚠️ What Requires Coordination

### Activities Needing Team Coordination

⚠️ **Modifying shared components:**
```
src/app/shared/components/layouts/TableLayout.tsx
```
**Why needs coordination:** Everyone uses this!

**Solution:**
1. Post in Slack: "I want to improve TableLayout"
2. Discuss with team
3. Create a branch
4. Open Pull Request
5. Team reviews
6. Merge when approved

⚠️ **Changing core infrastructure:**
```
src/app/core/types.ts
```
**Why needs coordination:** Affects entire system

**Solution:** Dev team handles this

---

## 🔄 Collaboration Patterns

### Pattern 1: Everyone Works Independently

**Use when:** Each designer has unique research question

**Workflow:**
1. Each creates own prototype
2. Work in parallel
3. Share findings at end
4. Archive when done

**Example:**
- Sarah: Testing empty states
- Mike: Testing button colors
- Anna: Testing form layouts

**No collaboration needed during work!**

---

### Pattern 2: Team Explores One Topic

**Use when:** Testing variations of same feature

**Workflow:**
1. Each designer creates a variation
2. All test the same thing differently
3. Compare results
4. Choose best approach

**Example:**
- Sarah: Onboarding flow - Option A
- Mike: Onboarding flow - Option B
- Anna: Onboarding flow - Option C

**Directory structure:**
```
prototypes/
├─ sarah-onboarding-option-a/
├─ mike-onboarding-option-b/
└─ anna-onboarding-option-c/
```

**Still isolated! No conflicts!**

---

### Pattern 3: Iterating on Each Other's Work

**Use when:** Building on someone else's prototype

**Workflow:**
1. Sarah creates initial prototype
2. Mike wants to iterate on it
3. Mike copies Sarah's prototype:
   ```bash
   cp -r sarah-empty-states mike-empty-states-v2
   ```
4. Mike edits his copy
5. Both exist independently!

**Sarah's original is untouched!**

---

## 🌍 Remote Team Best Practices

### Time Zones: No Problem!

**San Francisco team (Pacific):**
- Works 9am-5pm PST
- Pushes changes end of day
- London team wakes up to new prototypes

**London team (GMT):**
- Works 9am-5pm GMT
- Pushes changes end of day
- Berlin team sees updates next morning

**Berlin team (CET):**
- Works 9am-5pm CET
- Pushes changes end of day
- SF team sees updates next morning

**Result:** 24-hour development cycle!

---

### Communication Tools

**Slack Channels:**
```
#design-prototypes          - General discussion
#design-empty-states        - Topic-specific
#design-help                - Get help
#design-showcase            - Demo completed work
```

**Async Updates:**
```
Daily: Post what you're working on
Weekly: Share prototype for feedback
Monthly: Present research findings
```

**Sync Meetings (Optional):**
```
Weekly design review: 1 hour
  - Each designer: 5 min demo
  - Discuss patterns
  - Q&A
```

---

## 📊 Tracking 20 Prototypes

### Prototype Dashboard (Using the Launcher)

**Filter by Status:**
- **Active (8):** Currently being tested
- **Draft (6):** In development
- **Archived (12):** Research complete

**Filter by Owner:**
- Sarah Chen (3 prototypes)
- Mike Johnson (2 prototypes)
- Anna Schmidt (2 prototypes)
- [etc.]

**Filter by Tags:**
- `empty-states` (4 prototypes)
- `forms` (3 prototypes)
- `navigation` (2 prototypes)

**Search:**
- "button" → Shows all prototypes tagged with "button"

---

## 🎯 Real Example: Week in the Life

### Monday Morning (Sarah in SF)

```bash
# 9am PST: Pull latest
git pull origin main

# Create new prototype
cd src/app/prototypes
cp -r _template sarah-cluster-creation-flow

# Edit config
code sarah-cluster-creation-flow/prototype.config.ts

# Start building
code sarah-cluster-creation-flow/pages/HomePage.tsx

# Test locally
npm run start:dev
# Opens launcher, selects her prototype
```

### Monday Evening (Sarah)

```bash
# 5pm PST: Save work
git add src/app/prototypes/sarah-cluster-creation-flow
git commit -m "Initial cluster creation flow"
git push

# Goes home, work is saved
```

### Tuesday Morning (Mike in London)

```bash
# 9am GMT (1am PST - Sarah is sleeping): Pull updates
git pull origin main

# Sees Sarah's new prototype appear in launcher!
# Can test it if he wants

# Creates his own prototype
cp -r _template mike-error-messaging
# ... works on his prototype ...
```

### Tuesday Evening (Mike)

```bash
# 5pm GMT: Push work
git push

# Sarah wakes up in SF and will see Mike's prototype
```

### Wednesday (Anna in Berlin)

```bash
# 9am CET: Pull updates
git pull origin main

# Sees both Sarah's AND Mike's prototypes
# Creates her own
cp -r _template anna-data-visualization
# ... works independently ...
```

### Friday (Everyone)

```bash
# All pull latest
git pull origin main

# All 20 designers' prototypes appear in the launcher
# Team meeting: Everyone demos their prototype
# Zero conflicts all week!
```

---

## ✅ Collaboration Checklist

### For Each Designer

**Daily:**
- [ ] Pull latest: `git pull origin main`
- [ ] Work in your directory only
- [ ] Test locally: `npm run start:dev`
- [ ] Commit progress: `git commit -m "Description"`
- [ ] Push end of day: `git push`

**Weekly:**
- [ ] Demo your prototype
- [ ] Get feedback
- [ ] Update based on feedback
- [ ] Archive if research complete

**Never:**
- [ ] ❌ Edit other designers' prototype directories
- [ ] ❌ Edit shared components without discussing
- [ ] ❌ Edit core infrastructure files
- [ ] ❌ Delete others' prototypes

---

## 🆘 Conflict Resolution (Rare!)

### If Git Says "Conflict"

**Most common cause:** Two designers edited the same file

**Shouldn't happen if following rules!** But if it does:

```bash
# See what's conflicting
git status

# If it's your file - easy fix
git checkout --ours path/to/file

# If it's not your file - DON'T TOUCH IT
# Ask the file owner to resolve

# Push when resolved
git push
```

**Prevention:** Follow the "own directory" rule!

---

## 🎉 Success Metrics

### You'll Know It's Working When:

✅ **20 designers working simultaneously**
- No blocking each other
- No conflicts
- Everyone productive

✅ **No coordination overhead**
- Don't need permission to start prototype
- Don't need to schedule work
- Work at your own pace

✅ **Fast iteration**
- Create prototype in morning
- Test with users in afternoon
- Iterate next day

✅ **Easy discovery**
- Find others' prototypes in launcher
- Learn from each other's work
- Reuse good patterns

✅ **Clean history**
- Active prototypes easy to find
- Archived prototypes preserved
- Clear ownership

---

## 📞 Support for Remote Teams

### For Questions

**Slack:**
- `#design-prototypes` - General help
- `@dev-team` - Technical issues
- `@research-lead` - Process questions

**Office Hours:**
- Daily: 2-3pm GMT (covers most time zones)
- 1-hour Zoom
- Drop in with questions

**Documentation:**
- `DESIGNERS_GUIDE.md` - Complete tutorial
- `FOR_DESIGNERS.md` - Quick reference
- This file - Collaboration guide

**Pairing:**
- New designer? Pair with experienced designer
- Complex prototype? Pair with developer
- Video call, screen share, learn together

---

## 💡 Pro Tips

### Tip 1: Name Your Prototype Clearly

Include your name:
- `sarah-empty-states` not just `empty-states`

Why: Easy to know who owns it

### Tip 2: Document Your Work

Update your `README.md`:
- What you're testing
- Variations created
- Findings so far

Why: Others can learn from your work

### Tip 3: Tag Appropriately

Use tags in `prototype.config.ts`:
```typescript
tags: ['empty-states', 'clusters', 'research-2024-11']
```

Why: Others can find related prototypes

### Tip 4: Archive When Done

Change status to `'archived'`:
```typescript
status: 'archived'
```

Why: Keeps active list clean

### Tip 5: Share Patterns

Found a good component pattern?
- Post in Slack
- Consider moving to shared library
- Help others avoid reinventing

---

## 🎯 Bottom Line

### How 20 Designers Collaborate Without Conflicts:

1. **Each has own directory** → Isolated work
2. **Git handles coordination** → Automatic merging
3. **Launcher shows all prototypes** → Easy discovery
4. **Clear ownership** → Know who to ask
5. **Archive when done** → Keep things organized

**Result:** 20 designers working as efficiently as 1, but producing 20x the output!

---

## 🚀 Getting Started as a Team

### Week 1: Onboarding

**Monday - Setup Day:**
1. All designers join Slack channels
2. Dev team runs 1-hour workshop
3. Everyone creates test prototype
4. Everyone pushes to Git successfully

**Tuesday-Friday - Practice:**
1. Each designer builds real prototype
2. Push/pull daily
3. See each other's prototypes
4. Get comfortable with workflow

### Week 2+: Full Speed

- 8-10 active prototypes at any time
- Designers working independently
- Weekly demos on Friday
- Archive completed research

---

**Questions? Check `DESIGNERS_GUIDE.md` or ask in `#design-prototypes`!**

**Made with ❤️ for distributed design teams**

