#!/usr/bin/env node

/**
 * Create New Prototype Script
 * 
 * Usage:
 *   npm run create-prototype <prototype-name>
 *   node scripts/create-prototype.js <prototype-name>
 * 
 * Examples:
 *   npm run create-prototype my-awesome-feature
 *   npm run create-prototype cluster-wizard-v2
 */

const fs = require('fs');
const path = require('path');

// Get prototype name from command line arguments
const prototypeName = process.argv[2];

if (!prototypeName) {
  console.error('❌ Error: Prototype name is required');
  console.log('\nUsage:');
  console.log('  npm run create-prototype <prototype-name>');
  console.log('\nExample:');
  console.log('  npm run create-prototype my-awesome-feature');
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

console.log(`✅ Prototype "${prototypeName}" created successfully!`);
console.log(`\n📁 Location: ${targetDir}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Edit ${path.join(targetDir, 'prototype.config.ts')}`);
console.log(`      - Update owner.name, owner.slack, owner.email`);
console.log(`      - Update persona.name and persona.role`);
console.log(`      - Add relevant tags`);
console.log(`   2. Build your pages in ${path.join(targetDir, 'pages')}`);
console.log(`   3. Update routes in ${path.join(targetDir, 'routes.tsx')}`);
console.log(`   4. Refresh your browser - it will appear in the Draft tab!`);
console.log(`\n🎉 Happy prototyping!`);

