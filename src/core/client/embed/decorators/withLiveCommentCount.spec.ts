import { EventEmitter2 } from "eventemitter2";

import withLiveCommentCount from "./withLiveCommentCount";

beforeAll(() => {
  const elementWithID = document.createElement("span");
  elementWithID.className = "coral-count";
  elementWithID.dataset.coralId = "story-1";
  elementWithID.innerHTML =
    '<span class="coral-count-number">1</span> <span class="coral-count-text">Comment</span>';
  document.body.appendChild(elementWithID);

  const elementWithURL = document.createElement("span");
  elementWithURL.className = "coral-count";
  elementWithURL.dataset.coralUrl = "http://localhost/stories/story-1";
  elementWithURL.innerHTML =
    '<span class="coral-count-number">1</span> <span class="coral-count-text">Comment</span>';
  document.body.appendChild(elementWithURL);

  const nonMatchingElement = document.createElement("span");
  nonMatchingElement.className = "coral-count";
  nonMatchingElement.dataset.coralId = "story-x";
  nonMatchingElement.innerHTML =
    '<span class="coral-count-number">4</span> <span class="coral-count-text">Comments</span>';
  document.body.appendChild(nonMatchingElement);

  const wrongSelectorElement = document.createElement("span");
  wrongSelectorElement.className = "x-count";
  wrongSelectorElement.dataset.coralId = "story-1";
  wrongSelectorElement.innerHTML =
    '<span class="coral-count-number">1</span> <span class="coral-count-text">Comment</span>';
  document.body.appendChild(wrongSelectorElement);
});

it("should live update counts when receiving a commentCount event", () => {
  const events = new EventEmitter2({ wildcard: true });
  withLiveCommentCount(events);
  events.emit("commentCount", {
    number: 2,
    storyID: "story-1",
    storyURL: "http://localhost/stories/story-1",
    text: "Comments",
  });
  expect(document.body).toMatchSnapshot();
});
