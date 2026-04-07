#!/usr/bin/env node
/**
 * AI-powered DS compliance review using Claude API.
 * Skips gracefully if ANTHROPIC_API_KEY is not set.
 */
import { execSync } from 'node:child_process';

const { ANTHROPIC_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO } = process.env;

if (!ANTHROPIC_API_KEY) {
  console.log('ANTHROPIC_API_KEY not set — skipping AI review.');
  process.exit(0);
}

// Get changed files
const diff = execSync('git diff origin/main...HEAD -- "*.jsx" "*.tsx" "*.css"', { encoding: 'utf8' });
if (!diff.trim()) {
  console.log('No JSX/CSS changes to review.');
  process.exit(0);
}

const prompt = `You are a design-system compliance reviewer. Review this code diff for:
1. Hardcoded colors instead of DS tokens
2. Custom CSS that duplicates DS component functionality
3. Missing DS component usage where appropriate
4. Accessibility issues (missing alt text, aria labels)

Be concise. Only flag real issues. Format as a markdown list.

\`\`\`diff
${diff.slice(0, 8000)}
\`\`\``;

try {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const review = data?.content?.[0]?.text || 'No review generated.';
  console.log('AI Review:\n' + review);

  // Post as PR comment if we have a token
  if (GITHUB_TOKEN && PR_NUMBER && REPO) {
    await fetch(`https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: '## AI Design System Review\n\n' + review }),
    });
    console.log('Posted review comment on PR #' + PR_NUMBER);
  }
} catch (err) {
  console.error('AI review failed:', err.message);
  // Non-blocking — don't fail the workflow
  process.exit(0);
}
