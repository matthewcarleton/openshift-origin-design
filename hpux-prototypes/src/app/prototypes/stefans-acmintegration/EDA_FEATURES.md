# Event-Driven Ansible (EDA) Features for ACM Integration

## Current Implementation ✅

### Templates & Jobs
- **Templates Page**: Job templates and workflows for VM automation
- **Jobs Page**: Job execution history and monitoring
- **Template Detail**: View template details, variables, and job history
- **Job Detail**: View job output, details, and artifacts

## Missing EDA Components ❌

### 1. **Rulebooks** (Critical)
- **Purpose**: YAML files that define event processing logic
- **Features Needed**:
  - Create/edit rulebooks (YAML editor)
  - Rulebook activation/deactivation
  - Link rulebooks to job templates
  - Rulebook versioning
  - Rulebook validation
  - Import/export rulebooks

### 2. **Event Sources** (Critical)
- **Purpose**: Configure sources that generate events (webhooks, Kafka, database changes, etc.)
- **Features Needed**:
  - Create event sources (webhook URLs, Kafka topics, database triggers)
  - Event source authentication/credentials
  - Event source status monitoring
  - Event source filtering
  - Test event sources

### 3. **Rule Activations** (Critical)
- **Purpose**: Manage which rules are active and monitor their status
- **Features Needed**:
  - Activate/deactivate rules
  - View active rule status
  - Rule execution history
  - Rule performance metrics
  - Rule dependencies

### 4. **Event Stream** (Important)
- **Purpose**: Real-time monitoring of events flowing through the system
- **Features Needed**:
  - Live event feed
  - Event filtering and search
  - Event details (payload, source, timestamp)
  - Event statistics
  - Event replay

### 5. **Event History** (Important)
- **Purpose**: Logs of past events for auditing and troubleshooting
- **Features Needed**:
  - Event log viewer
  - Filter by date, source, type, status
  - Search events
  - Export event logs
  - Event correlation

### 6. **Decision Environments** (Important)
- **Purpose**: Runtime environments that execute rulebooks
- **Features Needed**:
  - Create/manage decision environments
  - Environment resource allocation
  - Environment status monitoring
  - Environment logs
  - Environment scaling

### 7. **Projects/Repositories** (Nice to Have)
- **Purpose**: SCM integration for rulebooks and automation content
- **Features Needed**:
  - Link to Git repositories
  - Sync rulebooks from SCM
  - Version control integration
  - Branch/tag management

### 8. **Credentials** (Nice to Have)
- **Purpose**: Secure storage for accessing external systems
- **Note**: May already exist in ACM's Credentials section
- **Features Needed**:
  - Create credentials for event sources
  - Credential rotation
  - Credential usage tracking

## Recommended Navigation Structure

```
Fleet Management
├── Automation (new group)
│   ├── Templates (existing)
│   ├── Jobs (existing)
│   ├── Rulebooks (new)
│   ├── Event Sources (new)
│   ├── Rule Activations (new)
│   ├── Event Stream (new)
│   ├── Event History (new)
│   └── Decision Environments (new)
```

## Priority Implementation Order

1. **Rulebooks** - Core EDA component
2. **Event Sources** - Required to trigger rules
3. **Rule Activations** - Required to manage active rules
4. **Event Stream** - Important for monitoring
5. **Event History** - Important for troubleshooting
6. **Decision Environments** - Required for rulebook execution
7. **Projects/Repositories** - Nice to have for SCM integration
8. **Credentials** - May already exist in ACM

## Integration Points

- **Rulebooks → Templates**: Rules can trigger job templates
- **Event Sources → Rulebooks**: Events trigger rulebook execution
- **Rule Activations → Decision Environments**: Active rules run in decision environments
- **Event Stream → Event History**: Events flow from stream to history
- **Jobs → Event Sources**: Job completion can trigger events


