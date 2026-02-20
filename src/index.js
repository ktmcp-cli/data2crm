/**
 * Data2CRM CLI - Main Command Interface
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import * as api from './lib/api.js';
import { setConfig, getConfig, getAllConfig, clearConfig } from './lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('data2crm')
  .description(chalk.cyan('Data2CRM API CLI - Universal CRM integration platform'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ data2crm config set apiKey <your-api-key>
  $ data2crm descriptors list --type salesforce
  $ data2crm accounts list --limit 50
  $ data2crm contacts list --limit 50
  $ data2crm sync start --source hubspot --target salesforce

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://www.data2crm.com/api/')}

${chalk.bold('Get API Key:')}
  ${chalk.blue('https://www.data2crm.com/')}
`);

// Config commands
const config = program.command('config').description('Manage configuration');

config
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action((key, value) => {
    setConfig(key, value);
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  });

config
  .command('get')
  .description('Get a configuration value')
  .argument('<key>', 'Configuration key')
  .action((key) => {
    const value = getConfig(key);
    console.log(value || chalk.gray('(not set)'));
  });

config
  .command('list')
  .description('List all configuration')
  .action(() => {
    const cfg = getAllConfig();
    console.log(JSON.stringify(cfg, null, 2));
  });

config
  .command('clear')
  .description('Clear all configuration')
  .action(() => {
    clearConfig();
    console.log(chalk.green('✓ Configuration cleared'));
  });

// Descriptors commands
const descriptors = program.command('descriptors').description('Manage CRM descriptors');

descriptors
  .command('list')
  .description('List available CRM descriptors')
  .option('--type <type>', 'Filter by CRM type (salesforce, hubspot, etc.)')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching CRM descriptors...').start();
    try {
      const data = await api.get('/descriptors', options.type ? { type: options.type } : {});
      spinner.succeed('Descriptors retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch descriptors');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Accounts commands
const accounts = program.command('accounts').description('Manage CRM accounts');

accounts
  .command('list')
  .description('List accounts')
  .option('--limit <number>', 'Number of accounts to retrieve', '50')
  .option('--offset <number>', 'Offset for pagination', '0')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching accounts...').start();
    try {
      const data = await api.get('/accounts', {
        limit: parseInt(options.limit),
        offset: parseInt(options.offset),
      });
      spinner.succeed('Accounts retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch accounts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

accounts
  .command('get')
  .description('Get account by ID')
  .argument('<id>', 'Account ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Fetching account ${id}...`).start();
    try {
      const data = await api.get(`/accounts/${id}`);
      spinner.succeed('Account retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch account');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Contacts commands
const contacts = program.command('contacts').description('Manage CRM contacts');

contacts
  .command('list')
  .description('List contacts')
  .option('--limit <number>', 'Number of contacts to retrieve', '50')
  .option('--offset <number>', 'Offset for pagination', '0')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching contacts...').start();
    try {
      const data = await api.get('/contacts', {
        limit: parseInt(options.limit),
        offset: parseInt(options.offset),
      });
      spinner.succeed('Contacts retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch contacts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

contacts
  .command('get')
  .description('Get contact by ID')
  .argument('<id>', 'Contact ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Fetching contact ${id}...`).start();
    try {
      const data = await api.get(`/contacts/${id}`);
      spinner.succeed('Contact retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch contact');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Sync commands
const sync = program.command('sync').description('Manage CRM synchronization');

sync
  .command('start')
  .description('Start a sync job')
  .option('--source <crm>', 'Source CRM system')
  .option('--target <crm>', 'Target CRM system')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Starting sync job...').start();
    try {
      const data = await api.post('/sync/start', {
        source: options.source,
        target: options.target,
      });
      spinner.succeed('Sync job started');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to start sync');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

sync
  .command('status')
  .description('Get sync job status')
  .argument('<jobId>', 'Sync job ID')
  .option('--json', 'Output as JSON')
  .action(async (jobId, options) => {
    const spinner = ora(`Fetching sync status for ${jobId}...`).start();
    try {
      const data = await api.get(`/sync/status/${jobId}`);
      spinner.succeed('Sync status retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch sync status');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
