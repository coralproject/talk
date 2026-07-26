import { render } from "@testing-library/react";
import React from "react";

import {
  CoralContext,
  CoralContextProvider,
  getUIContextPropsFromCoralContext,
} from "./CoralContext";

describe("CoralContext direction handling", () => {
  it("derives dir='rtl' for ar-AE locale", () => {
    const mockContext: CoralContext = {
      locales: ["ar-AE", "en-US"],
      renderWindow: window,
    } as any;

    const props = getUIContextPropsFromCoralContext(mockContext);
    expect(props.dir).toBe("rtl");
  });

  it("derives dir='ltr' for en-US locale", () => {
    const mockContext: CoralContext = {
      locales: ["en-US"],
      renderWindow: window,
    } as any;

    const props = getUIContextPropsFromCoralContext(mockContext);
    expect(props.dir).toBe("ltr");
  });

  it("sets dir attribute on document element in CoralContextProvider", () => {
    const mockContext: CoralContext = {
      locales: ["ar-AE"],
      localeBundles: [],
      renderWindow: window,
    } as any;

    render(
      <CoralContextProvider value={mockContext}>
        <div>Test Content</div>
      </CoralContextProvider>
    );

    expect(document.body.getAttribute("dir")).toBe("rtl");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });
});
