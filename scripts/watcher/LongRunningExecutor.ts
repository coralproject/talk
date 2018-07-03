import { ChildProcess } from "child_process";
import spawn from "cross-spawn";
import { Cancelable, debounce } from "lodash";
import { Executor } from "./types";

interface LongRunningExecutorOptions {
  args?: ReadonlyArray<string>;

  // Specifiy the period in which the process is restarted at max once.
  debounce?: number;
}

export default class LongRunningExecutor implements Executor {
  private cmd: string;
  private args?: ReadonlyArray<string>;
  private process: ChildProcess | null = null;
  private isRunning: boolean = false;
  private shouldRestart: boolean = false;
  private debounce: number;
  private restartDebounced: (() => void) & Cancelable;

  constructor(cmd: string, opts: LongRunningExecutorOptions = {}) {
    this.cmd = cmd;
    this.args = opts.args;
    this.debounce = opts.debounce || 1000;
    this.restartDebounced = debounce(() => this.restart(), this.debounce, {
      leading: true,
    });
  }

  private spawnProcess() {
    this.isRunning = true;
    this.process = spawn(this.cmd, this.args as string[], {
      stdio: "inherit",
      // Have all child processes in their own group.
      // See `process.kill` below.
      detached: true,
      shell: !this.args,
    });

    this.process!.on("exit", (code: number) => {
      this.isRunning = false;

      if (code !== 0 && code !== null) {
        // tslint:disable-next-line: no-console
        console.error(`Exit code returned ${code}`);
        return;
      }
      if (this.shouldRestart) {
        // We killed it pipe because we wanted to restart it.
        this.spawnProcess();
      }
    });
  }

  private restart(): void {
    this.shouldRestart = true;
    // Using the `-` will kill all child procceses in the group.
    // See: https://azimi.me/2014/12/31/kill-child_process-node-js.html
    process.kill(-this.process!.pid, "SIGTERM");
  }

  private kill(): void {
    this.shouldRestart = false;
    // Using the `-` will kill all child procceses in the group.
    // See: https://azimi.me/2014/12/31/kill-child_process-node-js.html
    process.kill(-this.process!.pid, "SIGTERM");
  }

  // This is called before watching starts.
  public onInit(): void {
    this.spawnProcess();
  }

  // This is called before exiting.
  public onCleanup() {
    this.restartDebounced.cancel();
    if (this.isRunning) {
      this.kill();
    }
  }

  public execute(filePath: string) {
    if (this.isRunning) {
      this.restartDebounced();
      return;
    }
    this.spawnProcess();
  }
}
