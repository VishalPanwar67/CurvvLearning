# Git & GitHub: Ultra‑Detailed Command‑Wise Developer Guide

This guide explains **every Git command**, what it does, **why it exists**, **when to use it**, and **what happens internally**.  
Perfect for beginners, revision, and interviews.

---

## 1. What is Git?

Git is a **distributed version control system** that tracks changes in files and allows multiple developers to work safely on the same project.

Git stores data as **snapshots**, not differences.

---

## 2. Git vs GitHub

| Git                       | GitHub             |
| ------------------------- | ------------------ |
| Local software            | Cloud platform     |
| Tracks code               | Hosts code         |
| Works offline             | Needs internet     |
| Created by Linus Torvalds | Owned by Microsoft |

---

## 3. Installing Git

Download:
https://git-scm.com/downloads

Verify installation:

```bash
git --version
```

**Explanation:**  
Shows installed Git version. If Git is not installed, this command fails.

---

## 4. Initial Configuration Commands

### `git config --global user.name`

```bash
git config --global user.name "Your Name"
```

**What it does:**  
Sets your name globally for all repositories.

**Why needed:**  
Git records who made each commit.

---

### `git config --global user.email`

```bash
git config --global user.email "you@example.com"
```

**What it does:**  
Associates commits with your email (should match GitHub).

---

### `git config --list`

```bash
git config --list
```

**What it does:**  
Displays all active Git configurations.

---

## 5. Repository Commands

### `git init`

```bash
git init
```

**What it does:**  
Creates a `.git` directory and starts tracking the folder.

**Internally:**  
Initializes Git objects, HEAD pointer, and default branch.

---

### `git clone`

```bash
git clone <repo-url>
```

**What it does:**  
Downloads an entire repository including history.

**Use when:**  
Starting work on an existing project.

---

## 6. Status & Inspection Commands

### `git status`

```bash
git status
```

**What it shows:**

- Modified files
- Staged files
- Untracked files
- Current branch

This is the **most used Git command**.

---

## 7. Staging Commands

### `git add <file>`

```bash
git add index.js
```

**What it does:**  
Moves file changes to the **staging area**.

---

### `git add .`

```bash
git add .
```

**What it does:**  
Stages **all changes** in the current directory.

---

## 8. Commit Commands

### `git commit -m`

```bash
git commit -m "Add login validation"
```

**What it does:**  
Creates a permanent snapshot of staged changes.

**Best practice:**  
One task per commit.

---

### `git commit --amend`

```bash
git commit --amend
```

**What it does:**  
Edits the last commit (message or content).

---

## 9. Log & History Commands

### `git log`

```bash
git log
```

**What it shows:**  
Complete commit history.

---

### `git log --oneline`

```bash
git log --oneline
```

**What it does:**  
Shows compact commit history.

---

## 10. Branch Commands

### `git branch`

```bash
git branch
```

**What it does:**  
Lists all local branches.

---

### `git branch <name>`

```bash
git branch feature-login
```

**What it does:**  
Creates a new branch.

---

### `git switch`

```bash
git switch feature-login
```

**What it does:**  
Moves HEAD to another branch.

---

## 11. Merge Commands

### `git merge`

```bash
git merge feature-login
```

**What it does:**  
Combines branch histories.

---

## 12. Diff Commands

### `git diff`

```bash
git diff
```

**What it does:**  
Shows unstaged changes.

---

### `git diff --staged`

```bash
git diff --staged
```

**What it does:**  
Shows staged changes.

---

## 13. Stash Commands

### `git stash`

```bash
git stash
```

**What it does:**  
Temporarily saves uncommitted work.

---

### `git stash pop`

```bash
git stash pop
```

**What it does:**  
Applies stash and removes it.

---

## 14. Reset & Revert

### `git reset --soft`

```bash
git reset --soft HEAD~1
```

Keeps changes staged.

---

### `git reset --hard`

```bash
git reset --hard HEAD~1
```

Deletes commit and changes.

---

### `git revert`

```bash
git revert <commit>
```

Safely undoes a commit.

---

## 15. Rebase Commands

### `git rebase`

```bash
git rebase main
```

Rewrites commit history for clean logs.

---

## 16. Reflog Command

### `git reflog`

```bash
git reflog
```

Shows every HEAD movement.

---

## 17. Tag Commands

### `git tag`

```bash
git tag v1.0
```

Marks release points.

---

## 18. Remote Commands

### `git remote -v`

```bash
git remote -v
```

Lists remote URLs.

---

## 19. Push / Pull / Fetch

### `git push`

Uploads commits.

---

### `git pull`

Downloads and merges commits.

---

### `git fetch`

Downloads without merging.

---

## 20. SSH Commands

```bash
ssh-keygen -t ed25519 -C "email"
```

Creates secure authentication key.

---

## 21. Real‑World Workflow

1. git pull
2. git checkout -b feature
3. code
4. git add .
5. git commit
6. git push

---

## 22. Interview Notes

- HEAD is a pointer
- Branches are pointers
- Git stores snapshots

---
