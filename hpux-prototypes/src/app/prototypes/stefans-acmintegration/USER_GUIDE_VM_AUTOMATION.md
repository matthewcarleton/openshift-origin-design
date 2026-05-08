# User Guide: Automating VM Post-Provisioning with Event-Driven Ansible

## Scenario: Automate Post-Provisioning Tasks When a VM is Created

Based on the [Red Hat blog article](https://www.redhat.com/en/blog/ansible-automation-platform-openshift-virtualization-multi-cluster-environment), this guide walks you through setting up event-driven automation to automatically perform post-provisioning tasks (install packages, start services) and create network resources when a new VM is created on a remote OpenShift cluster.

---

## Step-by-Step Instructions

### Prerequisites
- Access to ACM Ansible integration prototype
- Ansible Automation Platform configured with:
  - Container groups for remote cluster execution
  - KubeVirt inventory configured
  - Job templates created (as shown in the article)

---

## Part 1: Create the Event Source

**Goal:** Configure a webhook endpoint that receives VM creation events from OpenShift Virtualization.

1. **Navigate to Event Sources**
   - In the Fleet Management perspective, go to **Automation** → **Event Sources**

2. **Create New Event Source**
   - Click **Create event source** button
   - Fill in the form:
     - **Name:** `VM Creation Webhook`
     - **Type:** `Webhook`
     - **Description:** `Receives VM lifecycle events from OpenShift Virtualization on remote clusters`
     - **URL:** `https://eda.example.com/webhooks/vm-creation`
     - **Authentication:** Select credentials (if required)
   - Click **Create**

3. **Copy Webhook URL**
   - After creation, note the webhook URL
   - You'll configure OpenShift Virtualization to send events to this URL

---

## Part 2: Create the Rulebook

**Goal:** Define the automation logic that triggers when a VM creation event is received.

1. **Navigate to Rulebooks**
   - Go to **Automation** → **Rulebooks**

2. **Create New Rulebook**
   - Click **Create rulebook** button
   - Fill in the form:
     - **Name:** `VM Post-Provisioning Automation`
     - **Description:** `Automatically performs post-provisioning tasks and creates network resources when a VM is created`
     - **Decision Environment:** Select your decision environment (e.g., `prod-env-01`)

3. **Edit Rulebook YAML**
   - Click **Edit rulebook** from the kebab menu
   - In the YAML editor, enter the following rulebook:

```yaml
---
- name: VM Post-Provisioning Automation
  hosts: localhost
  gather_facts: false
  sources:
    - name: vm_creation_webhook
      type: webhook
      source_url: "https://eda.example.com/webhooks/vm-creation"
  
  rules:
    - name: On VM Created
      condition:
        event:
          meta:
            source: "vm_creation_webhook"
          body:
            event_type: "vm.created"
      action:
        run_job_template:
          name: "Post-provisioning Tasks"
          organization: "Default"
          extra_vars:
            vm_name: "{{ event.body.vm_name }}"
            namespace: "{{ event.body.namespace }}"
            vm_ip: "{{ event.body.vm_ip }}"
      
    - name: On Post-Provisioning Complete
      condition:
        event:
          meta:
            source: "ansible_automation_platform"
          body:
            job_status: "successful"
            job_template: "Post-provisioning Tasks"
      action:
        run_job_template:
          name: "Create Network Resources"
          organization: "Default"
          extra_vars:
            vm_name: "{{ event.body.vm_name }}"
            namespace: "{{ event.body.namespace }}"
```

4. **Validate Rulebook**
   - Click **Validate** from the kebab menu
   - Fix any validation errors if present

5. **Save Rulebook**
   - Click **Save**

---

## Part 3: Link Event Source to Rulebook

**Goal:** Connect the event source to the rulebook so events trigger the automation.

1. **Navigate to Rulebooks**
   - Go to **Automation** → **Rulebooks**

2. **Edit Rulebook**
   - Find your rulebook: `VM Post-Provisioning Automation`
   - Click the kebab menu (⋮) → **Edit rulebook**

3. **Configure Event Source**
   - In the rulebook detail page, go to the **Event Sources** tab
   - Click **Add event source**
   - Select: `VM Creation Webhook`
   - Click **Save**

---

## Part 4: Activate the Rule

**Goal:** Activate the rule so it starts processing events.

1. **Navigate to Rule Activations**
   - Go to **Automation** → **Rule Activations**

2. **Activate Rule**
   - Find the rule: `On VM Created` (from your rulebook)
   - Click **Start** button (or use the kebab menu → **Activate**)
   - The status should change to **Running**

3. **Verify Activation**
   - Check that the status badge shows **Running** (green)
   - The rule is now listening for VM creation events

---

## Part 5: Configure OpenShift Virtualization to Send Events

**Goal:** Set up OpenShift Virtualization to send VM creation events to your webhook.

**Note:** This step is typically done via OpenShift CLI or API. Here's the configuration:

1. **Create Event Source in OpenShift**
   ```bash
   # Create a webhook configuration that sends VM creation events
   oc create configmap vm-webhook-config \
     --from-literal=webhook_url="https://eda.example.com/webhooks/vm-creation" \
     -n openshift-virtualization
   ```

2. **Configure VirtualMachine Controller**
   - Update the VirtualMachine controller to send events to the webhook URL
   - When a VM is created, it will POST an event to your webhook

---

## Part 6: Test the Automation

**Goal:** Verify that the event-driven automation works end-to-end.

1. **Create a Test VM**
   - In your remote OpenShift cluster, create a new VM
   - This should trigger the webhook event

2. **Monitor Event Stream**
   - Go to **Automation** → **Event Stream** (if available)
   - You should see the VM creation event arrive

3. **Check Rule Activation**
   - Go to **Automation** → **Rule Activations**
   - Find `On VM Created` rule
   - Check the **Events Processed** counter - it should increment
   - Check **Last Execution** timestamp

4. **Verify Job Execution**
   - Go to **Automation** → **Jobs**
   - You should see:
     - Job: `Post-provisioning Tasks` (triggered by the event)
     - Job: `Create Network Resources` (triggered after post-provisioning completes)
   - Both jobs should show **Success** status

5. **Check Event History**
   - Go to **Automation** → **Event History** (if available)
   - Filter by event source: `VM Creation Webhook`
   - Verify the event was received and processed

---

## Part 7: Monitor and Troubleshoot

**Goal:** Ensure the automation is working correctly and troubleshoot any issues.

1. **View Rule Metrics**
   - Go to **Automation** → **Rule Activations**
   - Click on `On VM Created` rule name
   - View the **Metrics** tab:
     - Events processed
     - Success rate
     - Average execution time
     - Error rate

2. **Check Job Output**
   - Go to **Automation** → **Jobs**
   - Click on a job name to view details
   - Check the **Output** tab for any errors
   - Review the **Artifacts** tab for VM information

3. **View Event Details**
   - In Event History, click on an event
   - Review the event payload
   - Check if the event matched the rule condition

4. **Troubleshoot Issues**
   - If events aren't being received:
     - Check Event Source status (should be **Connected**)
     - Verify webhook URL is correct
     - Test the webhook endpoint manually
   - If rules aren't activating:
     - Check rule status (should be **Running**)
     - Verify rulebook YAML syntax
     - Check decision environment is running
   - If jobs are failing:
     - Review job output for errors
     - Verify job templates exist and are configured correctly
     - Check container group configuration

---

## Expected Workflow Flow

When a VM is created on a remote OpenShift cluster:

1. **Event Triggered**
   - OpenShift Virtualization sends webhook event to: `https://eda.example.com/webhooks/vm-creation`
   - Event payload includes: `vm_name`, `namespace`, `vm_ip`, `event_type: "vm.created"`

2. **Event Received**
   - Event Source receives the webhook
   - Event is forwarded to the decision environment

3. **Rule Matched**
   - Rule `On VM Created` matches the event condition
   - Rule triggers the action: run `Post-provisioning Tasks` job template

4. **Job Execution**
   - Ansible Automation Platform launches a pod on the remote cluster (via container group)
   - Pod connects to the VM via SSH
   - Installs httpd package and starts the service

5. **Second Rule Triggered**
   - When post-provisioning completes, a success event is sent
   - Rule `On Post-Provisioning Complete` matches
   - Triggers `Create Network Resources` job template

6. **Network Setup**
   - Job creates a Service and Route on the remote cluster
   - Web server on VM is now accessible externally

7. **Completion**
   - All automation steps complete
   - VM is fully provisioned and accessible

---

## Summary

This event-driven automation eliminates the need to manually:
- Monitor for new VM creation
- Trigger post-provisioning tasks
- Set up network resources

Instead, the system automatically:
- Detects VM creation events
- Triggers appropriate automation workflows
- Ensures consistent VM configuration across clusters

---

## Related Resources

- [Red Hat Blog: Ansible Automation Platform for OpenShift Virtualization](https://www.redhat.com/en/blog/ansible-automation-platform-openshift-virtualization-multi-cluster-environment)
- Ansible Automation Hub: [redhat.openshift_virtualization](https://console.redhat.com/ansible/automation-hub/repo/published/redhat/openshift_virtualization/content/inventory/kubevirt/)
- KubeVirt Inventory Plugin Documentation


