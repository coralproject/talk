import timekeeper from "timekeeper";

beforeAll(async () => {
  timekeeper.freeze(new Date(1589310827300));

  const script = document.createElement("script");
  script.src = "http://localhost:8080/assets/js/count.js";
  Object.defineProperty(window.document, "currentScript", {
    value: script,
  });

  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = "http://localhost:8080/";
  document.head.appendChild(link);
});

afterAll(() => {
  timekeeper.reset();
});

function attachTag(attrs: object) {
  const element = document.createElement("span");
  element.className = "coral-count";
  Object.assign(element.dataset, attrs);
  document.body.appendChild(element);
}

beforeEach(async () => {
  document.body.innerHTML = "";
  const tags = [
    {
      coralUrl: "http://localhost:8080/story.html",
    },
    {
      coralId: "1234-5678-91021",
    },
    {
      notext: "true",
    },
    {},
  ];

  tags.forEach((attrs) => {
    attachTag(attrs);
  });

  (await import("../")).main();
});

it("Sets the JSONP callback", async () => {
  expect((window as any).CoralCount).toBeDefined();
});
