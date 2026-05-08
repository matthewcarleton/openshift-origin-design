# 🔀 Prototype Separation Levels

## Different Ways to Separate Prototypes

This guide explains how separated your prototypes can be, from "shared monorepo" to "completely independent applications."

---

## 📊 Separation Spectrum

### Level 1: Current Architecture (What You Have Now)
**Separation: Low**

```
src/app/
├─ routes.tsx                  ← SHARED (conflicts!)
├─ AppLayout.tsx               ← SHARED (conflicts!)
├─ use-case-1/                 ← Some isolation
├─ use-case-2/                 ← Some isolation
└─ use-case-aaq/               ← Some isolation
```

**Characteristics:**
- ❌ Shared central files (routes.tsx, AppLayout.tsx)
- ❌ Git conflicts common
- ❌ Can't work independently
- ✅ Easy to run all prototypes
- ✅ Shared dependencies

**Isolation: 30%**

---

### Level 2: Directory Isolation (Current Proposal)
**Separation: Medium**

```
src/app/
├─ core/                       ← SHARED (stable)
├─ shared/                     ← SHARED (coordinated)
└─ prototypes/
   ├─ sarah-empty-states/      ← ISOLATED
   ├─ mike-button-study/       ← ISOLATED
   └─ anna-forms/              ← ISOLATED
```

**Characteristics:**
- ✅ Each prototype in own directory
- ✅ Zero conflicts on prototype work
- ✅ Can work independently
- ✅ Shared components library
- ✅ Single launcher shows all
- ⚠️ Same git repository
- ⚠️ Same node_modules
- ⚠️ Same build system

**Isolation: 70%**

**This is what we've built!**

---

### Level 3: Git Submodules
**Separation: High**

```
HPUX-Prototypes/              ← Main repo
├─ core/                      ← Main repo
├─ shared/                    ← Main repo
└─ prototypes/
   ├─ sarah-empty-states/     ← Separate git repo (submodule)
   ├─ mike-button-study/      ← Separate git repo (submodule)
   └─ anna-forms/             ← Separate git repo (submodule)
```

**Characteristics:**
- ✅ Each prototype is separate git repository
- ✅ Independent git history
- ✅ Can grant different access permissions
- ✅ Can version independently
- ⚠️ More complex setup
- ⚠️ Still shares node_modules
- ⚠️ Still same build system

**Isolation: 85%**

---

### Level 4: Monorepo with Workspaces
**Separation: High**

```
HPUX-Prototypes/              ← Root
├─ packages/
│  ├─ core/                   ← Workspace package
│  ├─ shared/                 ← Workspace package
│  └─ prototypes/
│     ├─ sarah-empty-states/  ← Workspace package (own package.json)
│     ├─ mike-button-study/   ← Workspace package (own package.json)
│     └─ anna-forms/          ← Workspace package (own package.json)
└─ package.json               ← Root package.json
```

**Characteristics:**
- ✅ Each prototype is npm package
- ✅ Independent dependencies per prototype
- ✅ Can version independently
- ✅ Can publish to npm (optional)
- ✅ Better dependency management
- ⚠️ More complex setup
- ⚠️ Still one git repository

**Isolation: 90%**

---

### Level 5: Completely Separate Repositories
**Separation: Maximum**

```
GitHub Repos:
├─ hpux-core                  ← Separate repo
├─ hpux-shared                ← Separate repo (npm package)
└─ Individual prototype repos:
   ├─ sarah-empty-states      ← Completely separate repo
   ├─ mike-button-study       ← Completely separate repo
   └─ anna-forms              ← Completely separate repo
```

**Characteristics:**
- ✅ Complete independence
- ✅ Own git repository
- ✅ Own dependencies
- ✅ Own deployment
- ✅ Can live anywhere (GitHub, GitLab, etc.)
- ✅ Different access controls
- ❌ No single launcher
- ❌ More setup overhead
- ❌ Harder to share improvements

**Isolation: 100%**

---

## 🎯 Detailed Comparison

### Level 2: Directory Isolation (Current Proposal)

**Setup:**
```bash
# Clone one repo
git clone repo-url

# Install once
npm install

# Run launcher
npm run start:dev

# All prototypes available
```

**Working:**
```bash
# Create prototype
cp -r _template my-prototype

# Work in your directory
cd my-prototype

# Push to shared repo
git push
```

**Pros:**
- ✅ Simple setup
- ✅ Single launcher
- ✅ Easy discovery
- ✅ Shared components easy
- ✅ One build system

**Cons:**
- ⚠️ Everyone has access to all prototypes
- ⚠️ Single point of failure (repo)
- ⚠️ Same dependency versions

**Best for:**
- Single team/organization
- Internal prototypes
- Want easy collaboration
- Trust everyone with access

---

### Level 5: Completely Separate Repos

**Setup:**
```bash
# Each designer clones their own repo
git clone sarah-empty-states-repo
cd sarah-empty-states

# Each has own dependencies
npm install

# Each runs independently
npm run dev
```

**Working:**
```bash
# Work in your own repo
# No connection to others

# Your own git history
git commit
git push to-your-own-repo
```

**Pros:**
- ✅ Complete independence
- ✅ Different access controls
- ✅ Can use different frameworks
- ✅ Different npm versions
- ✅ No shared dependencies

**Cons:**
- ❌ No single launcher
- ❌ Can't easily see other prototypes
- ❌ Harder to share components
- ❌ More setup per prototype
- ❌ More maintenance

**Best for:**
- External collaborators
- Public prototypes
- Different organizations
- Need strict separation
- Different technology stacks

---

## 🤔 Which Level Should You Choose?

### Choose Level 2 (Directory Isolation) If:

✅ **Your situation:**
- Single team/organization
- Internal collaboration
- Want to share components
- Trust everyone with access
- Want easy onboarding
- Prefer simplicity

✅ **Your needs:**
- Quick prototype creation
- Easy discovery
- Shared learning
- Consistent technology
- Single launcher

**Complexity: Low**  
**Setup time: 1 hour**  
**Recommended for: 90% of teams**

---

### Choose Level 3 (Git Submodules) If:

✅ **Your situation:**
- Need separate git history per prototype
- Want independent versioning
- Some prototypes are sensitive
- Different teams own different prototypes

✅ **Your needs:**
- Fine-grained access control
- Independent git workflows
- Still want shared core

**Complexity: Medium**  
**Setup time: 4-6 hours**  
**Recommended for: Larger organizations**

---

### Choose Level 4 (Monorepo with Workspaces) If:

✅ **Your situation:**
- Large organization
- Many prototypes (50+)
- Need independent dependencies
- Want to publish prototypes as packages
- Complex dependency management

✅ **Your needs:**
- Scalability
- Professional tooling
- Flexibility in versions
- Can publish to npm

**Complexity: High**  
**Setup time: 1-2 days**  
**Recommended for: Enterprise teams**

---

### Choose Level 5 (Separate Repos) If:

✅ **Your situation:**
- External collaborators
- Different organizations
- Public prototypes
- Different technology stacks
- Maximum independence

✅ **Your needs:**
- Complete isolation
- Different frameworks per prototype
- Public/private mix
- No shared infrastructure

**Complexity: Very High**  
**Setup time: 1-2 hours per prototype**  
**Recommended for: Special cases only**

---

## 💡 Hybrid Approach

**You can mix levels!**

### Example: Level 2 + Level 5

**Internal prototypes:**
```
Main repo (Level 2):
└─ prototypes/
   ├─ internal-project-1/
   ├─ internal-project-2/
   └─ internal-project-3/
```

**External/public prototypes:**
```
Separate repos (Level 5):
├─ public-demo-prototype      (own repo)
└─ partner-collaboration      (own repo)
```

**Best of both worlds!**

---

## 🔧 How to Implement Levels 3-5

### Level 3: Git Submodules

**Initial setup:**

```bash
# In main repo
cd src/app/prototypes

# Add prototype as submodule
git submodule add https://github.com/org/sarah-prototype sarah-empty-states

# Commit the submodule reference
git commit -m "Add Sarah's prototype as submodule"
```

**Each designer's workflow:**

```bash
# Clone with submodules
git clone --recursive main-repo

# Or initialize submodules after cloning
git submodule update --init --recursive

# Work in submodule
cd src/app/prototypes/sarah-empty-states
git checkout -b feature
# make changes
git commit
git push to-submodule-repo

# Update main repo
cd ../../..
git add src/app/prototypes/sarah-empty-states
git commit -m "Update Sarah's prototype"
```

**Pros:**
- ✅ Each prototype is separate repo
- ✅ Independent git history
- ✅ Still integrated in main launcher

**Cons:**
- ⚠️ More complex git workflow
- ⚠️ Two-step commit process
- ⚠️ Submodule management overhead

---

### Level 4: Monorepo with Workspaces

**Structure:**

```json
// Root package.json
{
  "name": "hpux-prototypes",
  "private": true,
  "workspaces": [
    "packages/core",
    "packages/shared",
    "packages/prototypes/*"
  ]
}
```

**Each prototype:**

```json
// packages/prototypes/sarah-empty-states/package.json
{
  "name": "@hpux/sarah-empty-states",
  "version": "1.0.0",
  "dependencies": {
    "@hpux/shared": "workspace:*",
    "@patternfly/react-core": "^6.3.0"
    // ... its own dependencies
  }
}
```

**Commands:**

```bash
# Install all workspaces
npm install

# Run specific prototype
npm run dev --workspace=@hpux/sarah-empty-states

# Run all prototypes
npm run dev --workspaces

# Add dependency to specific prototype
npm install lodash --workspace=@hpux/sarah-empty-states
```

**Pros:**
- ✅ Independent dependencies
- ✅ Can publish as packages
- ✅ Better dependency management
- ✅ Scales to 100+ prototypes

**Cons:**
- ⚠️ More complex setup
- ⚠️ Requires workspace understanding
- ⚠️ More configuration

---

### Level 5: Completely Separate Repos

**Setup template repo:**

```bash
# Create template repo
git clone hpux-prototype-template
cd hpux-prototype-template

# Has core setup:
├─ src/
│  └─ pages/
├─ package.json
├─ webpack.config.js
└─ README.md
```

**Each designer:**

```bash
# Create their own repo from template
git clone hpux-prototype-template sarah-empty-states
cd sarah-empty-states

# Set their own remote
git remote set-url origin https://github.com/sarah/empty-states

# Install shared as npm package
npm install @hpux/shared-components

# Work independently
# ... build prototype ...
git push to-own-repo
```

**Central registry:**

```json
// prototypes-registry.json
{
  "prototypes": [
    {
      "name": "Empty States Exploration",
      "repo": "https://github.com/sarah/empty-states",
      "demo": "https://sarah.github.io/empty-states",
      "owner": "Sarah Chen"
    },
    {
      "name": "Button Placement Study",
      "repo": "https://github.com/mike/button-study",
      "demo": "https://mike.github.io/button-study",
      "owner": "Mike Johnson"
    }
  ]
}
```

**Pros:**
- ✅ Maximum independence
- ✅ Own deployment
- ✅ Can be public/private
- ✅ Different stacks possible

**Cons:**
- ❌ No single launcher
- ❌ Harder to share
- ❌ More maintenance
- ❌ More setup overhead

---

## 📊 Comparison Table

| Feature | Level 2 | Level 3 | Level 4 | Level 5 |
|---------|---------|---------|---------|---------|
| **Setup Complexity** | ⭐ Low | ⭐⭐ Medium | ⭐⭐⭐ High | ⭐⭐⭐⭐ Very High |
| **Git Conflicts** | None | None | None | N/A |
| **Independence** | 70% | 85% | 90% | 100% |
| **Single Launcher** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Shared Components** | ✅ Easy | ✅ Easy | ✅ Easy | ⚠️ Via npm |
| **Access Control** | ⚠️ All or nothing | ✅ Per prototype | ✅ Per package | ✅ Per repo |
| **Independent Deps** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Versioning** | Repo version | Per submodule | Per package | Per repo |
| **Discovery** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ⚠️ Manual |
| **Maintenance** | Low | Medium | High | High |
| **Best For** | Most teams | Large orgs | Enterprise | Special cases |

---

## 🎯 Recommendation for Your Team

Based on typical needs:

### Start with Level 2 (Directory Isolation)

**Why:**
- ✅ Solves 90% of collaboration problems
- ✅ Simple to implement (already done!)
- ✅ Easy for designers to use
- ✅ Quick prototype creation
- ✅ Built-in discovery

**Upgrade to Level 3 or 4 if:**
- You grow to 50+ prototypes
- Need fine-grained access control
- Have external collaborators
- Prototypes need different dependency versions

**Upgrade to Level 5 if:**
- Working with external organizations
- Need public prototypes
- Want different technology stacks
- Maximum independence required

---

## 🚀 Can You Separate Existing Prototypes?

### Yes! Here's how:

**For use-case-1 (Stefan's prototype):**

#### Option A: Migrate to Level 2 (Recommended)
```bash
# Move to new structure
mv src/app/use-case-1 src/app/prototypes/fleet-admin-rbac

# Add prototype.config.ts
# Now it's isolated!
```

#### Option B: Extract to Level 5 (Separate Repo)
```bash
# Create new repo
git init fleet-admin-rbac
cd fleet-admin-rbac

# Copy files
cp -r old-repo/src/app/use-case-1/* .

# Add package.json, webpack, etc.
# Push to own repository
git remote add origin github.com/stefan/fleet-admin-rbac
git push
```

**Same for all existing prototypes!**

---

## 💭 Decision Framework

### Ask yourself:

**1. Who needs access?**
- Same team → Level 2
- Different teams → Level 3
- External people → Level 5

**2. How many prototypes?**
- < 20 → Level 2
- 20-50 → Level 2 or 3
- 50+ → Level 4

**3. Technology consistency?**
- Same stack → Level 2
- Might vary → Level 4 or 5

**4. Maintenance resources?**
- Limited → Level 2
- Moderate → Level 3
- Plenty → Level 4 or 5

**5. Need for independence?**
- Low → Level 2
- Medium → Level 3
- High → Level 4
- Maximum → Level 5

---

## 🎉 Bottom Line

**Yes, you can completely separate prototypes!**

**Levels available:**
1. ❌ Current (shared files) - Don't recommend
2. ✅ **Directory isolation** - Recommended for most (what we built!)
3. ✅ Git submodules - For larger organizations
4. ✅ Monorepo workspaces - For enterprise scale
5. ✅ Separate repos - For maximum independence

**For your existing prototypes:**

**Option 1:** Migrate to Level 2 (directory isolation) → 70% isolation, simple  
**Option 2:** Extract to separate repos (Level 5) → 100% isolation, complex  

**Start with Level 2, upgrade only if needed!**

---

**Want help implementing Level 3, 4, or 5? Let me know which level fits your needs!**

