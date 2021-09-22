/* eslint-disable */
import React, { FunctionComponent } from "react";

import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  SelectField,
  Option
} from "coral-ui/components/v2";

import { StoryInfoDrawerQueryResponse as StoryResponse } from "coral-admin/__generated__/StoryInfoDrawerQuery.graphql";

export interface Props {
  onClose: () => void;
  story: NonNullable<StoryResponse["story"]>;
}

const ScrapeResult: FunctionComponent<{ result: [string, any] }> = ({
  result: [ key, val ]
}) => (
  <div>
    <span>{key}</span>: <span>{val}</span>
  </div>
);

const StoryInfoDrawerContainer: FunctionComponent<Props> = ({
  story,
  onClose,
}) => {
  // TODO: localize!
  return (
    <HorizontalGutter spacing={4}>
      <Flex justifyContent="flex-start">
        <Flex direction="column">
          <h3>
            STORY DETAILS {/* TODO: dynamically make all caps for localization */}
          </h3>
          <h1>
            {story.metadata?.title || "Untitled"}
          </h1>
          <a href={story.url}>{story.url}</a>
          <Flex direction="row">
            Status: <SelectField value={story.status}>
              <Option>{story.status}</Option> {/* TODO: update status on change */}
            </SelectField>
          </Flex>
          <Flex direction="row">
            <Icon size="md">supervisor_account</Icon>
            {story.metadata?.author} {/* TODO: handle no author */}
          </Flex>
          <Flex direction="row">
            <Icon size="md">calendar_today</Icon>
            {story.metadata?.publishedAt} {/* format */}
          </Flex>
          <h3>SCRAPED METADATA</h3>
          <Flex direction="column">
            {
              Object.entries(story.metadata as object)
                .filter(( [ , val ] ) => typeof val !== 'function' )
                .map((result) => <ScrapeResult result={result} />)
            }
          </Flex>
          <Button type="button">
            RESCRAPE
          </Button>
        </Flex>
      </Flex>
    </HorizontalGutter>
  );
};

export default StoryInfoDrawerContainer;
