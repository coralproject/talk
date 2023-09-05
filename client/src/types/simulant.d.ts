declare module "simulant" {
  type SimulantEvent = {};

  interface Simulant {
    (event: string, extendedParams: Record<string, any>): SimulantEvent;
    fire(
      target: HTMLElement,
      event: string | SimulantEvent,
      extendedParams?: Record<string, any>
    ): void;
    polyfill(): void;
  }

  const simulant: Simulant;
  export default simulant;
}
