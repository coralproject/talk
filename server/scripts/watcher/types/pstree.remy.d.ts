declare module "pstree.remy" {
  export default function psTree(
    pid: number,
    callback: (err: Error, kids: string[]) => void
  ): void;
}
