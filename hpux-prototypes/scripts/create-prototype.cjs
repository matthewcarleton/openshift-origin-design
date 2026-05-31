#!/usr/bin/env node

/**
 * Create New Prototype Script
 * 
 * Usage:
 *   npm run create-prototype <prototype-name>
 *   npm run create-draft <prototype-name>
 *   npm run new-prototype <prototype-name>
 * 
 * Examples:
 *   npm run create-prototype my-awesome-feature
 *   npm run create-draft cluster-wizard-v2
 *   npm run new-prototype rbac-research
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Get prototype name from command line arguments
const prototypeName = process.argv[2];

if (!prototypeName) {
  console.error('❌ Error: Prototype name is required');
  console.log('\nUsage:');
  console.log('  npm run create-prototype <prototype-name>');
  console.log('  npm run create-draft <prototype-name>');
  console.log('  npm run new-prototype <prototype-name>');
  console.log('\nExamples:');
  console.log('  npm run create-prototype my-awesome-feature');
  console.log('  npm run create-draft cluster-wizard-v2');
  process.exit(1);
}

// Validate prototype name (kebab-case)
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(prototypeName)) {
  console.error('❌ Error: Prototype name must be in kebab-case (lowercase letters, numbers, and hyphens)');
  console.log('\nExamples:');
  console.log('  ✅ my-awesome-feature');
  console.log('  ✅ cluster-wizard-v2');
  console.log('  ❌ MyAwesomeFeature');
  console.log('  ❌ my_awesome_feature');
  process.exit(1);
}

const templateDir = path.join(__dirname, '../src/app/prototypes/_template');
const targetDir = path.join(__dirname, '../src/app/prototypes', prototypeName);

// Check if template exists
if (!fs.existsSync(templateDir)) {
  console.error(`❌ Error: Template directory not found at ${templateDir}`);
  process.exit(1);
}

// Check if target already exists
if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Prototype "${prototypeName}" already exists at ${targetDir}`);
  process.exit(1);
}

// Copy template directory
console.log(`📦 Creating prototype "${prototypeName}" from template...`);

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirectory(templateDir, targetDir);

// Update prototype.config.ts
const configPath = path.join(targetDir, 'prototype.config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');

// Convert kebab-case to Title Case for display name
const displayName = prototypeName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

// Replace placeholder values
configContent = configContent.replace(
  /id: 'example-draft-prototype'/,
  `id: '${prototypeName}'`
);

configContent = configContent.replace(
  /name: 'Example Draft Prototype'/,
  `name: '${displayName}'`
);

configContent = configContent.replace(
  /description: 'This is an example draft prototype that demonstrates the template structure\. Copy this directory to create your own prototype\.'/,
  `description: '${displayName} prototype. Add your description here.'`
);

// Update dates to today
const today = new Date().toISOString().split('T')[0];
configContent = configContent.replace(
  /createdAt: '2025-01-10'/,
  `createdAt: '${today}'`
);
configContent = configContent.replace(
  /updatedAt: '2025-01-10'/,
  `updatedAt: '${today}'`
);

fs.writeFileSync(configPath, configContent, 'utf8');

// Update routes.tsx comment
const routesPath = path.join(targetDir, 'routes.tsx');
let routesContent = fs.readFileSync(routesPath, 'utf8');
routesContent = routesContent.replace(
  /\/\*\*[\s\S]*?Routes for \[Prototype Name\][\s\S]*?\*\//,
  `/**\n * Routes for ${displayName}\n * \n * Define all routes for your prototype here.\n */`
);
fs.writeFileSync(routesPath, routesContent, 'utf8');

// Prompt for design notes
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function promptDesignNotes() {
  console.log('\n📝 Design Notes (shown in the "Design Notes" panel for reviewers)');
  console.log('   Press Enter to skip any prompt and use placeholder text.\n');

  const designerNotes = await ask('   Designer notes summary (what this design explores, key decisions): ');
  const firstPagePath = await ask('   First page to navigate to (path, e.g. /observe/alerting): ');
  const firstPageName = firstPagePath
    ? await ask('   Name of that page (e.g. "Alert List"): ')
    : '';
  const firstPageNotes = firstPagePath
    ? await ask('   What should the reviewer look for on that page? (or Enter to skip): ')
    : '';

  rl.close();

  const resolvedDesignerNotes = designerNotes.trim() ||
    'TODO: Describe what this design is exploring and key design decisions.';

  let navigationGuideBlock = '';
  if (firstPagePath.trim()) {
    const resolvedPageName = firstPageName.trim() || 'TODO: Page name';
    const resolvedPageNotes = firstPageNotes.trim();
    navigationGuideBlock = `
  navigationGuide: [
    {
      page: '${resolvedPageName}',
      path: '${firstPagePath.trim()}',${resolvedPageNotes ? `\n      notes: '${resolvedPageNotes}',` : ''}
    },
  ],`;
  } else {
    navigationGuideBlock = `
  navigationGuide: [
    {
      page: 'TODO: Page name',
      path: '/todo/path',
      notes: 'TODO: What to look for on this page.',
    },
  ],`;
  }

  // Inject designNotes block before closing brace of config object
  let updatedConfig = fs.readFileSync(configPath, 'utf8');
  const designNotesBlock = `\n  designNotes: {\n    designerNotes: '${resolvedDesignerNotes}',${navigationGuideBlock}\n  },\n`;
  updatedConfig = updatedConfig.replace(/(\n};)$/, `${designNotesBlock}};`);
  fs.writeFileSync(configPath, updatedConfig, 'utf8');

  console.log(`\n✅ Prototype "${prototypeName}" created successfully!`);
  console.log(`\n📁 Location: ${targetDir}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Edit ${path.join(targetDir, 'prototype.config.ts')}`);
  console.log(`      - Update owner.name, owner.slack, owner.email`);
  console.log(`      - Update persona.name and persona.role`);
  console.log(`      - Add relevant tags`);
  console.log(`      - Finish filling in designNotes`);
  console.log(`   2. Build your pages in ${path.join(targetDir, 'pages')}`);
  console.log(`   3. Update routes in ${path.join(targetDir, 'routes.tsx')}`);
  console.log(`   4. Refresh your browser - it will appear in the Draft tab!`);
  console.log(`\n🎉 Happy prototyping!`);
}

promptDesignNotes().catch((err) => {
  console.error('Error during design notes prompts:', err);
  rl.close();
  process.exit(1);
});

