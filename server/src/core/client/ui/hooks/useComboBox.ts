import React, { useState } from "react";

/**
 * ActiveDescendant is the id of the current active selection, which needs to be passed to `aria-activedescendant` prop
 */
export type ActiveDescendant = string | undefined;

/** EventHandlers are the ones that should be passed to the TextField */
export interface EventHandlers {
  onBlur: React.EventHandler<React.FocusEvent>;
  onChange: React.EventHandler<React.FormEvent<HTMLInputElement>>;
  onKeyDown: React.EventHandler<React.KeyboardEvent>;
}

export type ListBoxOptionElement = React.ReactElement<{
  id: string;
  "aria-selected": boolean;
  onClick: React.EventHandler<React.MouseEvent>;
  href?: string;
}>;

/**
 * ListBoxOptionClickOrEnterHandler is called whenever a click or enter
 * occurs on a list box option
 */
export type ListBoxOptionClickOrEnterHandler = (
  evt: React.KeyboardEvent | React.MouseEvent,
  element: ListBoxOptionElement
) => void;

/**
 * ListBoxOption is the data for the options to pass to `useComboBox`.
 */
export interface ListBoxOption {
  element: ListBoxOptionElement;
  onClickOrEnter?: ListBoxOptionClickOrEnterHandler;
}

/**
 * useComboBox accepts an `id` and a list of `ListBoxOption` and returns
 * a managed list of `ListBoxOption`, the active descendant and event handlers
 * for the textfield. You can find the managed props of the elements in
 * the type `ListBoxOptionElements`.
 *
 * @param id unique identifier for accessibility purposes
 * @param opts options to show in the listbox
 */
export default function useComboBox<T extends ListBoxOption>(
  id: string,
  opts: T[]
): [T[], ActiveDescendant, EventHandlers] {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return [
    opts.map((item, i) => ({
      ...item,
      element: React.cloneElement(item.element, {
        id: `${id}-${i}`,
        "aria-selected": activeIndex === i,
        key: `${id}-${i}`,
        onClick:
          item.element.props.onClick ||
          ((evt: React.MouseEvent) => {
            if (item.onClickOrEnter) {
              item.onClickOrEnter(evt, item.element);
            }
          }),
      }),
    })),
    activeIndex !== null ? `${id}-${activeIndex}` : undefined,
    {
      onBlur: () => {
        /** Reset active selection when the textfield is blurred */
        setActiveIndex(null);
      },
      onChange: () => {
        /** Reset active selection when the text changes */
        setActiveIndex(null);
      },
      onKeyDown: (evt: React.KeyboardEvent) => {
        // On Arror Down
        if (evt.keyCode === 40) {
          if (activeIndex !== opts.length - 1) {
            if (activeIndex === null) {
              setActiveIndex(0);
            } else {
              setActiveIndex((activeIndex || 0) + 1);
            }
          }
          evt.preventDefault();
        }
        // On Arrow Up
        else if (evt.keyCode === 38) {
          if (activeIndex !== 0) {
            if (activeIndex === null) {
              setActiveIndex(0);
            } else {
              setActiveIndex((activeIndex || 0) - 1);
            }
          }
          evt.preventDefault();
        }
        // On ENTER
        else if (evt.keyCode === 13) {
          if (activeIndex !== null && opts[activeIndex].onClickOrEnter) {
            opts[activeIndex].onClickOrEnter!(evt, opts[activeIndex].element);
          }
        } else {
          // Any other key.
          setActiveIndex(null);
        }
      },
    },
  ];
}
