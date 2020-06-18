import chalk from "chalk";
import { ChildProcess } from "child_process";
import spawn from "cross-spawn";
import { Cancelable, debounce } from "lodash";
import psTree from "pstree.remy";

import { Executor } from "./types";

interface LongRunningExecutorOptions {
  args?: ReadonlyArray<string>;

  /** Specify the period in which the process is restarted at max once. */
  debounce?: number;
}

export default class LongRunningExecutor implements Executor {
  private cmd: string;
  private args?: ReadonlyArray<string>;
  private process: ChildProcess | null = null;
  private isRunning = false;
  private shouldRestart = false;
  private restartDebounced: (() => void) & Cancelable;

  constructor(cmd: string, opts: LongRunningExecutorOptions = {}) {
    this.cmd = cmd;
    this.args = opts.args;
    this.restartDebounced = debounce(
      () => this.restart(),
      opts.debounce || 500
    );
  }

  private spawnProcess() {
    this.isRunning = true;
    this.process = spawn(this.cmd, this.args as string[], {
      stdio: "inherit",
      shell: !this.args,
    });

    this.process.on("exit", (code: number) => {
      this.isRunning = false;

      if (code !== 0 && code !== null) {
        // eslint-disable-next-line no-console
        console.log(chalk.red(`Command exited with ${code}`));
        return;
      }
      if (this.shouldRestart) {
        this.shouldRestart = false;
        this.spawnProcess();
      }
    });
  }

  private restart() {
    this.shouldRestart = true;
    return this.internalKill();
  }

  private kill() {
    this.shouldRestart = false;
    return this.internalKill();
  }

  private async internalKill(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const signal = "SIGTERM";
      if (process.platform === "win32") {
        // Force kill (/F) the whole child tree (/T) by PID
        spawn.sync("taskkill", [
          "/pid",
          this.process!.pid.toString(),
          "/T",
          "/F",
        ]);
        resolve();
        return;
      }

      psTree(this.process!.pid, (err, kids) => {
        if (err) {
          reject(err);
        }
        if (kids) {
          spawn.sync("kill", [
            `-${signal}`,
            this.process!.pid.toString(),
            ...kids,
          ]);
        }
        resolve();
      });
    });
  }

  // This is called before watching starts.
  public onInit(): void {
    this.spawnProcess();
  }

  // This is called before exiting.
  public async onCleanup(): Promise<void> {
    this.restartDebounced.cancel();
    if (this.isRunning) {
      await this.kill();
    }
  }

  public execute(filePath: string): void {
    if (this.isRunning) {
      this.restartDebounced();
      return;
    }
    this.spawnProcess();
  }
}
