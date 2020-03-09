import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export enum RotateOptions {
  NOW = "NOW",
  IN10SECONDS = "IN10SECONDS",
  IN1DAY = "IN1DAY",
  IN1WEEK = "IN1WEEK",
  IN30DAYS = "IN30DAYS",
}

interface Props {
  value: string;
}

const RotationOption: FunctionComponent<Props> = ({ value }) => {
  switch (value) {
    case RotateOptions.NOW: {
      return <Localized id="configure-auth-sso-rotate-now">Now</Localized>;
    }
    case RotateOptions.IN10SECONDS: {
      return (
        <Localized id="configure-auth-sso-rotate-10seconds">
          10 seconds from now
        </Localized>
      );
    }
    case RotateOptions.IN1DAY: {
      return (
        <Localized id="configure-auth-sso-rotate-1day">
          1 day from now
        </Localized>
      );
    }
    case RotateOptions.IN1WEEK: {
      return (
        <Localized id="configure-auth-sso-rotate-1week">
          1 week from now
        </Localized>
      );
    }
    case RotateOptions.IN30DAYS: {
      return (
        <Localized id="configure-auth-sso-rotate-30days">
          30 days from now
        </Localized>
      );
    }
    default:
      return <Localized id="configure-auth-sso-rotate-now">Now</Localized>;
  }
};

export default RotationOption;
