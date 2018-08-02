import * as Talk from "./";

describe("Basic integration test", () => {
  const container: HTMLElement = document.createElement("div");
  let streamInterface: ReturnType<typeof Talk.render>;
  beforeAll(() => {
    container.id = "basic-integration-test-id";
    document.body.appendChild(container);
  });
  afterAll(() => {
    document.body.removeChild(container);
  });
  it("should render iframe", () => {
    streamInterface = Talk.render({
      id: "basic-integration-test-id",
    });
    expect(container.innerHTML).toMatchSnapshot();
  });
  it("should remove iframe", () => {
    streamInterface.remove();
    expect(container.innerHTML).toBe("");
  });
});
