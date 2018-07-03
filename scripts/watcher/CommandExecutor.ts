import spawn from "cross-spawn";
import { Executor } from "./types";

interface CommandExecutorOptions {
  args?: ReadonlyArray<string>;
}

export default class CommandExecutor implements Executor {
  private cmd: string;
  private args?: ReadonlyArray<string>;

  constructor(cmd: string, opts: CommandExecutorOptions = {}) {
    this.cmd = cmd;
    this.args = opts.args;
  }

  public execute(filePath: string) {
    const child = spawn(this.cmd, this.args as string[], {
      stdio: "inherit",
      shell: !this.args,
    });

    child.on("close", (code: number) => {
      if (code !== 0) {
        // tslint:disable-next-line: no-console
        console.log(`We had an error building ${code}`);
        return;
      }
    });
  }
}
