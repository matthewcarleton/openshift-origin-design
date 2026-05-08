# New Collaborator Workflow

## Optimal Workflow for Creating a New Prototype

**The recommended workflow is: Clone → Create Branch → Copy Template → Work**

This ensures your work is isolated in a feature branch from the start, making it easier to collaborate and manage changes.

## Step-by-Step Guide

### 1. Clone the Repository

```bash
git clone https://github.com/kuklas/HPUX-Prototypes.git
cd HPUX-Prototypes
```

### 2. Check Current Branch

```bash
git branch -a
# You should see branches like: main, ux-prototypes, etc.
```

### 3. Create Your Feature Branch

**IMPORTANT:** Create your branch BEFORE copying the template. This keeps your work isolated.

```bash
# Switch to the main working branch (usually ux-prototypes)
git checkout ux-prototypes

# Pull latest changes
git pull origin ux-prototypes

# Create your feature branch
git checkout -b your-name-prototype-name
# Example: git checkout -b anna-aaq
# Example: git checkout -b kevin-operatorhub
```

### 4. Copy the Template

```bash
# Copy the template directory to your prototype name
cp -r src/app/prototypes/_template src/app/prototypes/your-prototype-name
# Example: cp -r src/app/prototypes/_template src/app/prototypes/anna-aaq
```

### 5. Update Prototype Configuration

```bash
# Edit the prototype config file
cd src/app/prototypes/your-prototype-name
# Edit prototype.config.ts with your prototype details
```

Update `prototype.config.ts`:
- Change `id` to your prototype name
- Update `name`, `description`
- Set `owner` (your name)
- Set `persona` (your persona)
- Update `status` (usually "in-progress")
- Configure `perspectives` and `tags`

### 6. Start Working

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm start

# Navigate to the prototype launcher
# Click on your prototype card to start working
```

### 7. Commit Your Work

```bash
# Stage your changes
git add src/app/prototypes/your-prototype-name/

# Commit with a descriptive message
git commit -m "Add [your-prototype-name] prototype

- Copy template and configure prototype
- Set up initial pages and routes
- [Add other changes]"

# Push to remote
git push origin your-name-prototype-name
```

## Why This Order?

### ✅ Clone → Create Branch → Copy Template (RECOMMENDED)

**Advantages:**
- ✅ Work is isolated in your feature branch from the start
- ✅ Easy to switch between prototypes (just switch branches)
- ✅ Can commit incrementally without affecting others
- ✅ Template copy is part of your feature work
- ✅ Can create a pull request when ready
- ✅ Others can review your work before merging

**Workflow:**
```
Clone → Create Branch → Copy Template → Work → Commit → Push → PR
```

### ❌ Clone → Copy Template → Create Branch (NOT RECOMMENDED)

**Disadvantages:**
- ❌ Template copy happens on main/ux-prototypes branch
- ❌ Need to move changes to new branch (more steps)
- ❌ Risk of accidentally committing to wrong branch
- ❌ Harder to manage multiple prototypes

## Branch Naming Convention

Use this format: `your-name-prototype-name`

**Examples:**
- `anna-aaq` - Anna's AAQ prototype
- `kevin-operatorhub` - Kevin's OperatorHub prototype
- `stefan-rbac` - Stefan's RBAC prototype
- `stefan-cclm` - Stefan's CCLM prototype

## Working with Multiple Prototypes

If you're working on multiple prototypes:

```bash
# Switch between prototypes
git checkout anna-aaq
# Work on AAQ prototype

git checkout kevin-operatorhub
# Work on OperatorHub prototype

# Each prototype is in its own branch
```

## Pulling Latest Changes

When you need to get the latest changes from the main branch:

```bash
# Switch to main working branch
git checkout ux-prototypes

# Pull latest changes
git pull origin ux-prototypes

# Switch back to your feature branch
git checkout your-name-prototype-name

# Merge latest changes into your branch
git merge ux-prototypes

# Resolve any conflicts if needed
# Then continue working
```

## Creating a Pull Request

When your prototype is ready:

1. **Push your branch:**
   ```bash
   git push origin your-name-prototype-name
   ```

2. **Create a Pull Request:**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Add description
   - Request review

3. **After PR is merged:**
   ```bash
   # Switch back to main branch
   git checkout ux-prototypes
   
   # Pull merged changes
   git pull origin ux-prototypes
   
   # Delete local branch (optional)
   git branch -d your-name-prototype-name
   ```

## Quick Reference

```bash
# 1. Clone
git clone https://github.com/kuklas/HPUX-Prototypes.git
cd HPUX-Prototypes

# 2. Create branch
git checkout ux-prototypes
git pull origin ux-prototypes
git checkout -b your-name-prototype-name

# 3. Copy template
cp -r src/app/prototypes/_template src/app/prototypes/your-prototype-name

# 4. Configure
cd src/app/prototypes/your-prototype-name
# Edit prototype.config.ts

# 5. Work
npm start

# 6. Commit
git add src/app/prototypes/your-prototype-name/
git commit -m "Add your-prototype-name prototype"
git push origin your-name-prototype-name
```

## Need Help?

- See `src/app/prototypes/_template/README.md` for template documentation
- See `src/app/prototypes/_template/PAGE_TEMPLATE.md` for page layout rules
- See `src/app/prototypes/_template/WIZARD_PATTERN.md` for wizard patterns

