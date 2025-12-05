#!/usr/bin/env node

/**
 * Generate PR help text for /help command
 * Parses package.json to extract all fix:* commands and generates formatted markdown
 */

const fs = require('fs');
const path = require('path');

// Command descriptions mapping
const COMMAND_DESCRIPTIONS = {
  'fix:dict': 'Normalize cspell front matter in markdown files',
  'fix:expired': 'Delete expired content files',
  'fix:filenames': 'Rename files with underscores to kebab-case',
  'fix:format': 'Format code and trim trailing spaces',
  'fix:htmltest-config': 'Update htmltest configuration',
  'fix:i18n:status': 'Update internationalization status',
  'fix:i18n:new': 'Handle new internationalization files',
  'fix:i18n': 'Run all i18n fixes (new + status)',
  'fix:markdown': 'Fix markdown linting issues and trailing spaces',
  'fix:refcache:refresh': 'Refresh reference cache (prune entries)',
  'fix:refcache': 'Prune reference cache and check links',
  'fix:submodule': 'Pin submodules and update semconv mounts',
  'fix:text': 'Fix textlint issues',
  'fix:all': 'Run all fix commands (except i18n)',
  fix: 'Run all fix commands',
};

// Common usage examples
const USAGE_EXAMPLES = [
  {
    command: '/fix:format',
    description: 'Format all code files and fix spacing issues',
    when: 'Use when CI shows formatting errors',
  },
  {
    command: '/fix:markdown',
    description: 'Fix markdown linting issues',
    when: 'Use when markdownlint checks fail',
  },
  {
    command: '/fix:refcache',
    description: 'Update the reference cache for link checking',
    when: 'Use when link checker shows stale cached results',
  },
  {
    command: '/fix:submodule',
    description: 'Update git submodules to latest versions',
    when: 'Use when submodule updates are needed',
  },
];

// Troubleshooting tips
const TROUBLESHOOTING = [
  {
    issue: 'Command had no effect',
    solution:
      'The command may have run successfully but found nothing to fix. Check the workflow run logs for details.',
  },
  {
    issue: 'Command failed with errors',
    solution:
      'Check the workflow run logs for specific error messages. You may need to fix issues manually.',
  },
  {
    issue: 'Patch too large',
    solution:
      'The changes exceed 1MB limit. Break into smaller fixes or apply changes manually.',
  },
  {
    issue: 'Patch failed to apply',
    solution:
      'Conflicts with recent commits. Pull latest changes and run the fix locally.',
  },
];

function generateHelpText() {
  // Read package.json
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Extract all fix:* commands
  const fixCommands = Object.keys(packageJson.scripts)
    .filter((script) => script.startsWith('fix:'))
    .sort();

  // Generate markdown
  let markdown = `## 🤖 PR Actions Bot - Help\n\n`;
  markdown += `This bot can automatically fix common issues in your PR by responding to slash commands.\n\n`;

  // Available Commands
  markdown += `### 📋 Available Commands\n\n`;
  markdown += `Comment on this PR with any of these commands:\n\n`;

  fixCommands.forEach((cmd) => {
    const description = COMMAND_DESCRIPTIONS[cmd] || 'Run fix command';
    markdown += `- \`/${cmd}\` - ${description}\n`;
  });

  // Usage Examples
  markdown += `\n### 💡 Usage Examples\n\n`;
  USAGE_EXAMPLES.forEach((example) => {
    markdown += `**\`${example.command}\`**\n`;
    markdown += `- ${example.description}\n`;
    markdown += `- _${example.when}_\n\n`;
  });

  // How it works
  markdown += `### ⚙️ How It Works\n\n`;
  markdown += `1. Comment with a \`/fix:*\` command on this PR\n`;
  markdown += `2. The bot runs the command in a secure environment\n`;
  markdown += `3. If changes are needed, they're automatically committed to your branch\n`;
  markdown += `4. You'll get a success/failure notification\n\n`;

  // Troubleshooting
  markdown += `### 🔧 Troubleshooting\n\n`;
  TROUBLESHOOTING.forEach((tip) => {
    markdown += `**${tip.issue}**\n`;
    markdown += `${tip.solution}\n\n`;
  });

  // Documentation
  markdown += `### 📚 Documentation\n\n`;
  markdown += `- [Contributing Guide](https://opentelemetry.io/docs/contributing/)\n`;
  markdown += `- [Project README](../CONTRIBUTING.md)\n`;
  markdown += `- [PR Actions Workflow](.github/workflows/pr-actions.yml)\n\n`;

  markdown += `---\n`;
  markdown += `_💬 Need more help? Ask in the PR comments or reach out to maintainers._\n`;

  return markdown;
}

// Main execution
if (require.main === module) {
  try {
    const helpText = generateHelpText();
    console.log(helpText);
  } catch (error) {
    console.error('Error generating help text:', error.message);
    process.exit(1);
  }
}

module.exports = { generateHelpText };
