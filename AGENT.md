# Data2CRM CLI - Agent Guide

This CLI provides access to the Data2CRM API for universal CRM integration.

## Quick Start

```bash
# Configure API key
data2crm config set apiKey YOUR_API_KEY

# List CRM descriptors
data2crm descriptors list --json

# List accounts
data2crm accounts list --limit 50 --json

# List contacts
data2crm contacts list --limit 50 --json

# Start sync job
data2crm sync start --source hubspot --target salesforce --json

# Check sync status
data2crm sync status <job-id> --json
```

## Available Commands

- `config` - Manage configuration (set, get, list, clear)
- `descriptors` - List available CRM descriptors
- `accounts` - Manage CRM accounts (list, get)
- `contacts` - Manage CRM contacts (list, get)
- `sync` - Manage synchronization between CRMs (start, status)

## Output Format

All commands support `--json` flag for machine-readable output. Use this flag when calling from AI agents.

## Error Handling

If a command fails, it will exit with code 1 and print an error message to stderr.

## Authentication

The CLI uses an API key for authentication. Set it using:
- `data2crm config set apiKey <key>`
- Or environment variable: `DATA2CRM_API_KEY`

Get your API key from: https://www.data2crm.com/
