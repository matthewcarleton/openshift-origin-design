# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Browser / User Interface                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                              App Shell                                   │
│  • React Router                                                          │
│  • Global providers                                                      │
│  • Initialize prototype registry                                         │
└──────────────────┬───────────────────────────────┬──────────────────────┘
                   │                               │
                   │                               │
         ┌─────────▼─────────┐         ┌──────────▼──────────┐
         │ No Prototype      │         │ Prototype Selected   │
         │    Selected       │         │                      │
         └─────────┬─────────┘         └──────────┬──────────┘
                   │                               │
                   │                               │
         ┌─────────▼─────────┐         ┌──────────▼──────────┐
         │                   │         │                      │
         │  Prototype        │         │   AppLayout with     │
         │  Launcher         │         │   Prototype Routes   │
         │                   │         │                      │
         └───────────────────┘         └──────────────────────┘
```

## Detailed Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Application Layers                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Core Infrastructure (Do Not Modify)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  src/app/core/                                                      │
│  │                                                                   │
│  ├─ types.ts                  Type definitions                      │
│  ├─ PrototypeRegistry.ts      Prototype discovery & registration   │
│  ├─ PrototypeContext.tsx      React context for active prototype   │
│  ├─ PrototypeLauncher.tsx     UI for selecting prototypes          │
│  └─ AppShell.tsx               Main application shell              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Layer 2: Shared Component Library (Coordinate Changes)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  src/app/shared/                                                    │
│  │                                                                   │
│  ├─ components/               Reusable UI components                │
│  │  ├─ layouts/              Page layouts                          │
│  │  ├─ tables/               Table components                      │
│  │  ├─ forms/                Form components                       │
│  │  ├─ wizards/              Wizard components                     │
│  │  └─ navigation/           Navigation components                 │
│  │                                                                   │
│  ├─ hooks/                    Custom React hooks                    │
│  ├─ contexts/                 Shared contexts                       │
│  ├─ utils/                    Utility functions                     │
│  ├─ types/                    Shared TypeScript types               │
│  └─ data/                     Shared mock data                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Layer 3: Prototypes (Independent, Isolated)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  src/app/prototypes/                                                │
│  │                                                                   │
│  ├─ fleet-admin-rbac/        Stefan's prototype                    │
│  │  ├─ prototype.config.ts   ← REQUIRED manifest                   │
│  │  ├─ README.md             Documentation                          │
│  │  ├─ routes.tsx            Routes definition                      │
│  │  ├─ navigation.tsx        Navigation structure (optional)        │
│  │  ├─ pages/                Page components                        │
│  │  ├─ components/           Prototype-specific components          │
│  │  ├─ data/                 Mock data                             │
│  │  └─ assets/               Images, icons, etc.                   │
│  │                                                                   │
│  ├─ virtualization-quotas/   Anna's prototype                       │
│  │  ├─ prototype.config.ts                                          │
│  │  └─ ...                                                          │
│  │                                                                   │
│  └─ operator-lifecycle/      Kevin's prototype                      │
│     ├─ prototype.config.ts                                          │
│     └─ ...                                                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌───────────────────────────────────────────────────────────────────────┐
│                        Prototype Lifecycle                             │
└───────────────────────────────────────────────────────────────────────┘

1. App Startup
   │
   ├─► Initialize Prototype Registry
   │   │
   │   ├─► Scan src/app/prototypes/
   │   ├─► Find all prototype.config.ts files
   │   ├─► Load each prototype module
   │   └─► Register in global registry
   │
   └─► Show Prototype Launcher
       │
       └─► Display all registered prototypes


2. User Selects Prototype
   │
   ├─► Load prototype module from registry
   │   │
   │   ├─► Get config
   │   ├─► Get routes
   │   └─► Get navigation (if defined)
   │
   ├─► Call onActivate() lifecycle hook (if defined)
   │
   ├─► Store active prototype in context
   │
   └─► Render AppLayout with prototype routes


3. User Interacts
   │
   ├─► Navigate between routes (React Router)
   ├─► Use prototype components
   └─► Access shared components via imports


4. User Switches Prototype
   │
   ├─► Call onDeactivate() lifecycle hook (if defined)
   ├─► Clear active prototype from context
   └─► Return to Prototype Launcher
```

## Component Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Dependency Flow                               │
└──────────────────────────────────────────────────────────────────────┘

         Core Infrastructure
                 │
                 │ provides
                 ▼
         Shared Components  ◄─────────────┐
                 │                        │
                 │ provides               │ uses
                 ▼                        │
            Prototypes                    │
                 │                        │
                 └────────────────────────┘

Rules:
• Core ─X─► Cannot depend on Prototypes
• Shared ─X─► Cannot depend on Prototypes
• Prototypes ✓ Can depend on Shared
• Prototypes ✓ Can depend on Core (via context/hooks)
• Prototypes ─X─► Cannot depend on other Prototypes
```

## File System Layout

```
HPUX Prototypes/
│
├─ src/
│  └─ app/
│     │
│     ├─ core/                    ← Core infrastructure
│     │  ├─ types.ts
│     │  ├─ PrototypeRegistry.ts
│     │  ├─ PrototypeContext.tsx
│     │  ├─ PrototypeLauncher.tsx
│     │  └─ AppShell.tsx
│     │
│     ├─ shared/                  ← Shared library
│     │  ├─ components/
│     │  │  ├─ layouts/
│     │  │  ├─ tables/
│     │  │  ├─ forms/
│     │  │  └─ wizards/
│     │  ├─ hooks/
│     │  ├─ contexts/
│     │  └─ utils/
│     │
│     └─ prototypes/              ← All prototypes
│        │
│        ├─ _template/            ← Template for new prototypes
│        │  ├─ prototype.config.ts
│        │  ├─ README.md
│        │  ├─ routes.tsx
│        │  └─ pages/
│        │
│        ├─ fleet-admin-rbac/     ← Individual prototype
│        │  ├─ prototype.config.ts
│        │  ├─ README.md
│        │  ├─ routes.tsx
│        │  ├─ navigation.tsx
│        │  ├─ pages/
│        │  ├─ components/
│        │  └─ data/
│        │
│        └─ ... (more prototypes)
│
├─ PROTOTYPE_ARCHITECTURE.md      ← Full architecture docs
├─ MIGRATION_GUIDE.md             ← How to migrate existing code
├─ QUICK_START.md                 ← Getting started guide
└─ README.md                      ← Project overview
```

## Git Branching Strategy

```
main (protected)
│
├─── shared/developer-name/feature-name
│    │
│    └─► Changes to src/app/shared/
│         Requires PR and review
│
└─── prototypes/developer-name/prototype-name
     │
     └─► Changes to src/app/prototypes/developer-name-prototype/
          Can merge directly (your prototype, your rules)
```

## Collaboration Workflow

```
┌────────────────────────────────────────────────────────────────────┐
│                    Developer Workflow                               │
└────────────────────────────────────────────────────────────────────┘

Developer A (Stefan)           Developer B (Anna)           Developer C (Kevin)
      │                               │                            │
      ├─ Create                       ├─ Create                   ├─ Create
      │  prototype/                   │  prototype/                │  prototype/
      │  fleet-admin-rbac/            │  virt-quotas/              │  operator-lifecycle/
      │                               │                            │
      │                               │                            │
      ├─ Work in isolation            ├─ Work in isolation        ├─ Work in isolation
      │  No conflicts!                │  No conflicts!            │  No conflicts!
      │                               │                            │
      │                               │                            │
      ├─ Use shared components ───────┼────────────────────────────┼─ Use shared components
      │                               │                            │
      │                               │                            │
      │  ┌─ Need new shared          │                            │
      │  │  component?                │                            │
      │  │                            │                            │
      │  └─► Create PR ───────────────┼────► Review ◄──────────────┼─ Review
      │      to shared/               │                            │
      │                               │                            │
      │  ┌─ PR approved               │                            │
      │  │                            │                            │
      │  └─► Merge to main ◄──────────┼────────────────────────────┼─ Can now use it!
      │                               │                            │
      │                               │                            │
      └─ Push prototype ──────────────┴────────────────────────────┴─ Push prototype
         anytime                           anytime                     anytime

Result: Everyone works independently, shares what's useful!
```

## Scaling the System

```
┌────────────────────────────────────────────────────────────────────┐
│                    Scalability                                      │
└────────────────────────────────────────────────────────────────────┘

Current: 7 prototypes

┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Prototype│  │ Prototype│  │ Prototype│  │ Prototype│
│    1    │  │    2    │  │    3    │  │    4    │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Prototype│  │ Prototype│  │ Prototype│
│    5    │  │    6    │  │    7    │
└─────────┘  └─────────┘  └─────────┘

Future: 50+ prototypes, no problem!

Each prototype:
• Registers itself automatically
• Appears in launcher
• Runs independently
• Can be archived when done

No limit to number of prototypes!
```

## Technical Stack

```
┌────────────────────────────────────────────────────────────────────┐
│                    Technology Stack                                 │
└────────────────────────────────────────────────────────────────────┘

Frontend Framework:     React 18
UI Library:             PatternFly 6
Routing:                React Router 7
State Management:       React Context + Hooks
Type System:            TypeScript
Build Tool:             Webpack 5
Package Manager:        npm
Module System:          ES Modules

Development:
• Hot Module Reload
• TypeScript checking
• ESLint for code quality
• PatternFly theming
```

## Security & Isolation

```
┌────────────────────────────────────────────────────────────────────┐
│                    Isolation Guarantees                             │
└────────────────────────────────────────────────────────────────────┘

✅ File System Isolation
   Each prototype in separate directory
   Can't accidentally modify others' files

✅ Runtime Isolation
   Each prototype loaded independently
   No shared state between prototypes

✅ Navigation Isolation
   Routes defined per-prototype
   No route conflicts possible

✅ Data Isolation
   Each prototype has own mock data
   No accidental data sharing

✅ Style Isolation
   PatternFly provides scoped styles
   No CSS conflicts

⚠️  Shared Component Changes
   Changes to shared components affect all users
   Requires PR review process
```

## Performance Considerations

```
┌────────────────────────────────────────────────────────────────────┐
│                    Performance                                      │
└────────────────────────────────────────────────────────────────────┘

Lazy Loading:
• Only active prototype is loaded
• Reduces initial bundle size
• Fast switching between prototypes

Code Splitting:
• Each prototype is a separate chunk
• Webpack automatically splits bundles
• Only load what's needed

Caching:
• Active prototype ID cached in sessionStorage
• Restores last prototype on reload
• No re-selection needed

Build Optimization:
• Tree shaking removes unused code
• Minification for production
• Source maps for debugging
```

---

## Summary

This architecture provides:

1. **100% Isolation** - Work without conflicts
2. **Easy Sharing** - Reuse common components
3. **Auto-Discovery** - No manual registration
4. **Scalability** - Handle 50+ prototypes easily
5. **Flexibility** - Each prototype is independent
6. **Collaboration** - Clear ownership and process

The key insight: **Isolated prototypes + Shared components = Productive collaboration**

