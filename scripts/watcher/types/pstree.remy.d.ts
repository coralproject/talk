declare module "pstree.remy" {
  export default function psTree(
    pid: number,
    callback: (err: Error, kids: Array<{ PID: number }>) => void
  ): void;
}
