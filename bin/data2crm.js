#!/usr/bin/env node

/**
 * Data2CRM CLI - Main Entry Point
 *
 * Production-ready CLI for Data2CRM API
 * Universal CRM integration platform
 */

import('../src/index.js').catch(err => {
  console.error('Failed to start CLI:', err);
  process.exit(1);
});
