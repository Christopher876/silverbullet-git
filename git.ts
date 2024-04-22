import { editor, shell } from "$sb/syscalls.ts";
import { readSetting } from "$sb/lib/settings_page.ts";

enum AuthType {
  token = "token",
  UserPass = "userpass",
  SSHKey = "sshkey",
}

/* Improvements:
 * Allow for the use of an ssh key, credentials and token
 * Remove the "Github" specific parts since it can be used with any git repository
 * Add a way to specify the branch to clone
 * Provide a way to specify how to handle conflicts -- rebase or merge
 * Add a way to specify the commit message
 *
 * Most of these improvements are going to be specified in the settings page
 */


export async function commit(message?: string) {
  if (!message) {
    message = "Snapshot";
  }
  console.log(
    "Snapshotting the current space to git with commit message",
    message,
  );
  const { code } = await shell.run("git", ["add", "./*"]);
  console.log("Git add code", code);
  try {
    await shell.run("git", ["commit", "-a", "-m", message]);
  } catch {
    // We can ignore, this happens when there's no changes to commit
  }
  console.log("Done!");
}

export async function snapshotCommand() {
  let revName = await editor.prompt(`Revision name:`);
  if (!revName) {
    revName = "Snapshot";
  }
  console.log("Revision name", revName);
  await commit(revName);
  await editor.flashNotification("Done!");
}

export async function syncCommand() {
  await editor.flashNotification("Syncing with git");
  await sync();
  await editor.flashNotification("Git sync complete!");
}

async function sync() {
  console.log("Going to sync with git");
  await commit();
  console.log("Then pulling from remote");
  await shell.run("git", ["pull"]);
  console.log("And then pushing to remote");
  await shell.run("git", ["push"]);
  console.log("Done!");
}

export async function infoCommand() {
  const git = await readSetting("git", {});
  await editor.flashNotification( 
    `Auto commit is set to ${git.autoCommitMinutes} minutes and auto sync is set to ${git.autoSync}`
  );
  await editor.flashNotification(
    `Token is ${git.token}, name is ${git.name}, email is ${git.email}`
    );
}

function runGitCommand(command: string) {
  const args = command.split(" ");
  return shell.run("git", args);
}

export async function cloneCommand() {
  const git = await readSetting("git", {});
  
  let url = git.url;
  let authType: AuthType = git.authType as AuthType;
  let authData = git.authData; // Token, user:pass, or ssh key location
  let name = git.name;
  let email = git.email;
  let verifyCert = git.verifyCert;
  // TODO: Handle if the values are not set
  
  // Handle authType token first
  // TODO: Handle other auth types
  switch (authType) {
    case AuthType.token:
      let token = authData;
      url = url.replace("https://", `https://${token}@`);
      break;
    default:
      await editor.flashNotification("Only token auth is supported right now");
      break;
  }
  await editor.flashNotification(`Cloning from ${url}`);

  await shell.run("mkdir", ["-p", "_checkout"]);

  if (verifyCert === false) {
    await shell.run("git", ["-c", "http.sslVerify=false", "clone", url, "_checkout"]);
  } else {
    await shell.run("git", ["clone", url, "_checkout"]);
  }
  // Moving all files from _checkout to the current directory, which will complain a bit about . and .., but we'll ignore that
  await shell.run("bash", ["-c", "mv -f _checkout/{.,}* . 2> /dev/null; true"]);
  await shell.run("rm", ["-rf", "_checkout"]);
  await shell.run("git", ["config", "user.name", name]);
  await shell.run("git", ["config", "user.email", email]);
  await editor.flashNotification(
    "Done. Now just wait for sync to kick in to get all the content.",
  );
}

export async function autoCommit() {
  const git = await readSetting("git", {});
  if (git.autoCommitMinutes) {
    console.log("Triggered auto commit with config", git);
    const currentMinutes = new Date().getMinutes();
    if (currentMinutes % git.autoCommitMinutes === 0) {
      console.log("Auto commit time!");
      if (git.autoSync) {
        await sync();
      } else {
        await commit("Auto commit");
      }
    }
  }
}
