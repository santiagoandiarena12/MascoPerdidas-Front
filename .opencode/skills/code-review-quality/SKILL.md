---
name: code-review-quality
description: 'Conduct context-driven code reviews focusing on quality, testability, and maintainability. Use when reviewing code, providing feedback, or establishing review practices.'
category: development-practices
priority: high
tags: [code-review, feedback, quality, testability, maintainability, pr-review]
---

# Code Review Quality

## When to Use

- PR code reviews
- Pair programming feedback
- Establishing team review standards
- Mentoring developers

## Feedback Priority Levels

| Level      | Icon | Meaning              | Action                  |
| ---------- | ---- | -------------------- | ----------------------- |
| Blocker    | 🔴   | Bug/security/crash   | Must fix before merge   |
| Major      | 🟡   | Logic issue/test gap | Should fix before merge |
| Minor      | 🟢   | Style/naming         | Nice to fix             |
| Suggestion | 💡   | Alternative approach | Consider for future     |

## Quick Review Checklist

- **Logic:** Does it work correctly? Edge cases handled?
- **Security:** Input validation? Auth checks? Injection risks?
- **Testability:** Can this be tested? Is it tested?
- **Maintainability:** Clear naming? Single responsibility? DRY?
- **Performance:** O(n²) loops? N+1 queries? Memory leaks?

## What to Focus On

| ✅ Review          | ❌ Skip                 |
| ------------------ | ----------------------- |
| Logic correctness  | Formatting (use linter) |
| Security risks     | Naming preferences      |
| Test coverage      | Architecture debates    |
| Performance issues | Style opinions          |
| Error handling     | Trivial changes         |

## Review Scope Limits

| Lines Changed | Recommendation        |
| ------------- | --------------------- |
| < 200         | Single review session |
| 200-400       | Review in chunks      |
| > 400         | Request PR split      |

## Feedback Templates

### Blocker (Must Fix)

```markdown
🔴 **BLOCKER: [Issue]**

[Describe the issue clearly]

**Fix:** [Suggest a solution]

**Why:** [Explain why this matters]
```

### Major (Should Fix)

```markdown
🟡 **MAJOR: [Issue]**

[What could go wrong]

**Suggestion:** [Recommended approach]
```

### Minor (Nice to Fix)

```markdown
🟢 **minor:** [Issue]

[Suggestion for improvement]
```

### Suggestion (Consider)

```markdown
💡 **suggestion:** [Alternative approach]

[Optional: reasoning]
```

## Review Etiquette

| ✅ Do                     | ❌ Don't                  |
| ------------------------- | ------------------------- |
| "Have you considered...?" | "This is wrong"           |
| Explain why it matters    | Just say "fix this"       |
| Acknowledge good code     | Only point out negatives  |
| Suggest, don't demand     | Be condescending          |
| Review < 400 lines        | Review 2000 lines at once |

## Remember

**Prioritize feedback:** 🔴 Blocker → 🟡 Major → 🟢 Minor → 💡 Suggestion. Focus on bugs and security, not style. Ask questions, don't command. Review < 400 lines at a time.
