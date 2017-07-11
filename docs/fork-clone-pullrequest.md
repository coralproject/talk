---
title: Fork, Clone and Pullrequest
keywords: homepage
sidebar: talk_sidebar
permalink: /fork-clone-pullrequest.html
summary:
---

Fork/Clone 
If you are new to the forking and cloning process, 
we recommend to follow [GitHub-Forking.md](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

```
# Clone your fork to your local machine
git clone git@github.com:USERNAME/talk.git

# Add 'upstream' repo to list of remotes
git remote add upstream git@github.com:coralproject/talk.git

# Verify the new remote named 'upstream'
git remote -v

# Fetch from upstream remote
git fetch upstream

# Checkout your master branch and merge upstream
git checkout master
git merge upstream/master

Create a Branch
# Checkout the master branch - you want your new branch to come from master
git checkout master

# Create a new branch named newfeature (give your branch its own simple informative name)
# e.g.[Issue-Number-Name] issue-42-waving-the-towel )
git branch newfeature

# Switch to your new branch
git checkout newfeature
```

[Pushing to a remote](https://help.github.com/articles/pushing-to-a-remote/).Todo: This could be more talk specific!
