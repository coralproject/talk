import spawn from "cross-spawn";

import { Executor } from "./types";

interface CommandExecutorOptions {
  args?: ReadonlyArray<string>;
  // If true, will spawn a new process for each file change.
  spawnMutiple?: boolean;
}

export default class CommandExecutor implements Executor {
  private cmd: string;
  private args?: ReadonlyArray<string>;
  private isRunning: boolean = false;
  private spawnMultiple: boolean = false;
  private shouldRespawn: boolean = false;

  constructor(cmd: string, opts: CommandExecutorOptions = {}) {
    this.cmd = cmd;
    this.args = opts.args;
  }

  private spawn() {
    if (this.isRunning && !this.spawnMultiple) {
      this.shouldRespawn = true;
      return;
    }
    this.isRunning = true;
    this.shouldRespawn = false;
    const child = spawn(this.cmd, this.args as string[], {
      stdio: "inherit",
      shell: !this.args,
    });

    child.on("close", (code: number) => {
      this.isRunning = false;
      if (code !== 0) {
        // tslint:disable-next-line: no-console
        console.log(`We had an error building ${code}`);
      }
      if (this.shouldRespawn) {
        this.spawn();
      }
    });
  }

  public execute(filePath: string) {
    this.spawn();
  }
}
