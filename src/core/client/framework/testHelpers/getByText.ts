import React from "react";
import { ReactTestInstance } from "react-test-renderer";

export default function getByText(text: string, instance: ReactTestInstance) {
  return instance.find(i => {
    if (!i.props.children) {
      return false;
    }
    const children = React.Children.toArray(i.props.children);
    for (const c of children) {
      if (
        typeof c === "string" &&
        c.toLowerCase().includes(text.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
}
