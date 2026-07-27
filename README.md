# Registry PR review analysis

Dataset used to design the `/review-registry-pr` skill for
open-telemetry/opentelemetry.io.

Scope: PRs labeled `registry` in open-telemetry/opentelemetry.io closed between
2026-01-28 and 2026-07-27 (180 days): 160 merged plus 20 closed without
merging.

- `registry-prs.csv`: one row per PR (number, title, author, state,
  closed_or_merged_at, url).
- `registry-comments.csv`: 237 review comments from those PRs, one row per
  comment (pr_number, pr_url, pr_state, comment_type, reviewer, created_at,
  path, category, body). Pure bot accounts and PR-author replies are excluded;
  bot status messages are kept and tagged `bot-status`. The `category` column
  is a manual classification: ci-fix-command, broken-link, spelling-cspell,
  process-workflow, registry-metadata, description-quality, duplicate-entry,
  and others.

Collected via the GitHub GraphQL API on 2026-07-27.
