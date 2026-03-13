# CLAUDE.md

This file provides context for AI assistants working in this repository.

## Repository Overview

**try_git** is a minimal Git tutorial/sandbox repository originally used to
demonstrate basic Git workflows. It was created on GitHub as part of the
"Try Git" interactive tutorial. The repository has a very small commit history
and currently contains no files in the working tree (all octocat text files
were added and later removed).

## Repository Structure

```
try_git/
└── (empty working tree — all files removed in final commit)
```

### Historical file structure (from git history)

```
try_git/
├── octocat.txt                  # "A Tale of Two Octocats"
├── blue_octocat.txt             # "A Blue Octocat"
├── red_octocat.txt              # "A Red Octocat"
└── octofamily/
    ├── baby_octocat.txt         # "A Baby Octocat"
    └── momma_octocat.txt        # "A Momma Octocat"
```

## Commit History

| SHA       | Message                    | Description                                      |
|-----------|----------------------------|--------------------------------------------------|
| `b576646` | Added cute octocat story   | Created `octocat.txt` with a one-line story      |
| `a31db32` | Add all the octocat txt files | Added four more octocat files (blue, red, octofamily) |
| `7c95da1` | Removed all the cats       | Deleted all five octocat txt files               |

The final state of `master` (and `HEAD`) is an empty working tree.

## Branches

- `master` — primary branch, mirrors the full commit history above
- `claude/add-claude-documentation-vZU62` — feature branch for adding this
  documentation (diverges from `master` at the same commit)

## Development Workflow

Since this is a learning/sandbox repository with no build system, tests, or
dependencies, the workflow is intentionally minimal:

1. Make changes directly in the working tree
2. Stage with `git add <file>` (or `git add .`)
3. Commit with a clear, descriptive message: `git commit -m "message"`
4. Push to the remote: `git push -u origin <branch-name>`

There are no linters, test runners, CI pipelines, or package managers
configured in this repository.

## Key Conventions

- **Commit messages**: short, imperative-mood summary (e.g. "Add octocat
  story", "Remove red octocat")
- **Branch naming**: feature branches use the `claude/<description>-<id>`
  pattern for AI-assisted work
- **Author identity**: original commits used `Try Git <try_git@github.com>` as
  the author; use your configured git identity for new commits
- **File content**: historically, files contained a single descriptive line
  (e.g. `A Blue Octocat`)

## Notes for AI Assistants

- The working tree is currently empty. Files can be restored from history via
  `git checkout <sha> -- <file>` or `git show <sha>:<file>`.
- There is no `.gitignore`, no `package.json`, no `Makefile`, and no other
  tooling configuration.
- This repository is purely a Git learning sandbox — avoid over-engineering
  any changes.
- Always develop on the designated `claude/` feature branch and push with
  `git push -u origin <branch-name>`.
