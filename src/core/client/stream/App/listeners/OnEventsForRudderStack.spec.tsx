import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import sinon from "sinon";

import { createSinonStub } from "coral-framework/testHelpers";

import { OnEventsForRudderStack } from "./OnEventsForRudderStack";

it("Broadcasts events to rudderstack", () => {
  const testCases = [
    {
      eventName: "mutation.setSomething",
      expected: "mutation.setSomething",
    },
    {
      eventName: "subscription.subscribeToSomething",
      expected: "subscription.subscribeToSomething",
    },
    {
      eventName: "fetch.fetchSomething",
      expected: "fetch.fetchSomething",
    },
    {
      eventName: "viewer.clickedOnSomething",
      expected: "clickedOnSomething",
    },
    {
      eventName: "internal.otherStuff",
      expected: null,
    },
  ];
  testCases.forEach((testCase) => {
    const value = { value: true };
    const eventName = testCase.eventName;
    const eventEmitter: any = {
      onAny: (cb: (eventName: string, value: any) => void) => {
        cb(eventName, value);
      },
    };

    const window: any = {
      rudderanalytics: {
        track: createSinonStub(
          (s) => s.throws(),
          (s) =>
            s.withArgs(testCase.expected, value, sinon.match.func).returns(null)
        ),
      },
    };

    createRenderer().render(
      <OnEventsForRudderStack eventEmitter={eventEmitter} window={window} />
    );
    if (testCase.expected) {
      expect(window.rudderanalytics.track.calledOnce).toBe(true);
    }
  });
});
