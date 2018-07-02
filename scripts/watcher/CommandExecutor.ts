import spawn from "cross-spawn";
import { Executor } from "./types";

export default class CommandExecutor implements Executor {
  private cmd: string;
  private args: ReadonlyArray<string>;

  constructor(cmd: string, args: ReadonlyArray<string>) {
    this.cmd = cmd;
    this.args = args || [];
  }

  public execute(filePath: string) {
    const child = spawn(this.cmd, this.args as string[], { stdio: "inherit" });

    child.on("close", (code: number) => {
      if (code !== 0) {
        // tslint:disable-next-line: no-console
        console.log(`We had an error building ${code}`);
        return;
      }
    });
  }
}
