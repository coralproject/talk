import cn from "classnames";
import React, {
  ComponentType,
  FunctionComponent,
  HTMLAttributes,
  Ref,
} from "react";

import {
  AlertTriangleIcon,
  CalendarInformationIcon,
  ConversationChatTextIcon,
  MessagesBubbleSquareIcon,
  QuestionHelpMessageIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { withForwardRef, withStyles } from "coral-ui/hocs";

import styles from "./MessageBoxIcon.css";

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /** The name of the icon to render */
  icon: string;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

export const MessageBoxIcon: FunctionComponent<Props> = (props) => {
  const { classes, className } = props;
  const rootClassName = cn(classes.root, className);

  // This maps the Material icon names to new Streamline icon names
  const iconMapping: { [index: string]: ComponentType } = {
    question_answer: ConversationChatTextIcon,
    today: CalendarInformationIcon,
    help_outline: QuestionHelpMessageIcon,
    warning: AlertTriangleIcon,
    chat_bubble_outline: MessagesBubbleSquareIcon,
  };
  return (
    <SvgIcon
      className={rootClassName}
      Icon={iconMapping[props.icon]}
      ref={props.forwardRef}
    />
  );
};

MessageBoxIcon.defaultProps = {
  size: "md",
};

const enhanced = withForwardRef(withStyles(styles)(MessageBoxIcon));
export default enhanced;
