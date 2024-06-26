# SilverBullet plug for Git

Simple git plugin for SilverBullet.

{[Git: Sync]}:

- Adds all files in your folder to git
- It commits them with a "Snapshot" commit message
- It `git pull`s changes from the remote server
- It `git push`es changes to the remote server

{[Git: Snapshot]}:

- Asks you for a commit message
- Commits

{[Github: Clone]}:

Clones into your space from a Github repository. This will do authentication based on a [personal access token](https://github.com/settings/tokens).

## Configuration
This plug now supports auto commit and auto sync. You can configure this in your [[SETTINGS]] page as follows:

```yaml
git:
  autoCommitMinutes: 5
  autoSync: true # or false
```

This will automatically commit (and if `autoSync` is set to `true` perform a sync, meaning do the whole "push" and "pull" dance) every 5 minutes. If no changes were made, the git commands won't do anything.

## Installation

Open your `PLUGS` note in SilverBullet and add this plug to the list:

```
- github:Christopher876/silverbullet-git/git.plug.js
```

Then run the `Plugs: Update` command and off you go!

## Sample Configuration

```yaml
git:
  url: https://gitea.local/user/Notes.git
  authType: token
  authData: 00000
  name: Chris
  email: chris@example.com
  verifyCert: false
```

## To Build

```shell
deno task build
```
