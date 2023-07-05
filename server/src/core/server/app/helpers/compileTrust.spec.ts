import compileTrust from "./compileTrust";

it("parses boolean true", () => {
  expect(compileTrust("true")).toStrictEqual(true);
});

it("parses boolean false", () => {
  expect(compileTrust("false")).toStrictEqual(false);
});

it("parses a number", () => {
  for (let i = 0; i < 100; i++) {
    expect(compileTrust(`${i}`)).toStrictEqual(i);
  }
});

it("parses a list of aliases", () => {
  const aliases = "loopback, linklocal, uniquelocal";
  expect(compileTrust(aliases)).toStrictEqual(aliases);
});

it("parses an of address", () => {
  const address = "10.0.0.1";
  expect(compileTrust(address)).toStrictEqual(address);
});

it("parses a list of addresses", () => {
  const addresses = "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7";
  expect(compileTrust(addresses)).toStrictEqual(addresses);
});
