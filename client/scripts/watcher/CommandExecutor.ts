import chalk from "chalk";
import spawn from "cross-spawn";
import { Cancelable, debounce } from "lodash";

import { Executor } from "./types";

interface CommandExecutorOptions {
  args?: ReadonlyArray<string>;
  /** If true, allow spawning multiple processes. */
  spawnMutiple?: boolean;

  /** Specify the period in which the process is started at max once. */
  debounce?: number | false;

  /** If true, will run command upon initialization. */
  runOnInit?: boolean;
}

export default class CommandExecutor implements Executor {
  private cmd: string;
  private args?: ReadonlyArray<string>;
  private spawnMultiple: boolean;
  private runOnInit: boolean;
  private isRunning = false;
  private shouldRespawn = false;
  private spawnProcessDebounced?: (() => void) & Cancelable;

  constructor(cmd: string, opts: CommandExecutorOptions = {}) {
    this.cmd = cmd;
    this.args = opts.args;
    this.spawnMultiple = opts.spawnMutiple || false;
    this.runOnInit = opts.runOnInit || false;

    const wait = opts.debounce === undefined ? 500 : opts.debounce;
    if (wait) {
      this.spawnProcessDebounced = debounce(() => this.spawnProcess(), wait);
    }
  }

  // This is called before watching starts.
  public onInit(): void {
    if (this.runOnInit) {
      this.spawnProcessPotentiallyDebounced();
    }
  }

  private spawnProcessPotentiallyDebounced() {
    if (this.spawnProcessDebounced) {
      this.spawnProcessDebounced();
      return;
    }
    this.spawnProcess();
  }

  private spawnProcess() {
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
      if (code !== 0 && code !== null) {
        // eslint-disable-next-line no-console
        console.log(chalk.red(`Command exited with ${code}`));
      }
      if (this.shouldRespawn) {
        this.spawnProcessPotentiallyDebounced();
      }
    });
  }

  public execute(filePath: string): void {
    this.spawnProcessPotentiallyDebounced();
  }
}
