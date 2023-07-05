import cn from "classnames";
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import SimpleMDE from "simplemde";

import { useGetMessage } from "coral-framework/lib/i18n";
import { PropTypesOf } from "coral-ui/types";

import styles from "./MarkdownEditor.css";

export type ToolbarItem =
  | "bold"
  | "italic"
  | "title"
  | "quote"
  | "unorderedList"
  | "orderedList"
  | "link"
  | "image"
  | "preview"
  | "sideBySide"
  | "fullscreen"
  | "guide";

export const defaultToolbar: ToolbarItem[] = [
  "bold",
  "italic",
  "title",
  "quote",
  "unorderedList",
  "orderedList",
  "link",
  "image",
  "preview",
  "sideBySide",
  "fullscreen",
  "guide",
];

interface Props {
  id?: string;
  name?: string;
  onChange: (value: string) => void;
  value: string;
  toolbar?: ToolbarItem[];
  autoFocus?: boolean;
}

const MarkdownEditor: FunctionComponent<Props> = ({
  id,
  name,
  onChange,
  value,
  toolbar,
  autoFocus = false,
  ...rest
}) => {
  const getMessage = useGetMessage();
  const toolbarDefault = [
    {
      name: "bold",
      action: SimpleMDE.toggleBold,
      className: styles.iconBold,
      title: getMessage("framework-markdownEditor-bold", "Bold"),
    },
    {
      name: "italic",
      action: SimpleMDE.toggleItalic,
      className: styles.iconItalic,
      title: getMessage("framework-markdownEditor-italic", "Italic"),
    },
    {
      name: "title",
      action: SimpleMDE.toggleHeadingSmaller,
      className: styles.iconTitle,
      title: getMessage(
        "framework-markdownEditor-titleSubtitleHeading",
        "Title, Subtitle, Heading"
      ),
    },
    "|",
    {
      name: "quote",
      action: SimpleMDE.toggleBlockquote,
      className: styles.iconQuote,
      title: getMessage("framework-markdownEditor-quote", "Quote"),
    },
    {
      name: "unordered-list",
      action: SimpleMDE.toggleUnorderedList,
      className: styles.iconUnorderedList,
      title: getMessage("framework-markdownEditor-genericList", "Generic List"),
    },
    {
      name: "ordered-list",
      action: SimpleMDE.toggleOrderedList,
      className: styles.iconOrderedList,
      title: getMessage(
        "framework-markdownEditor-numberedList",
        "Numbered List"
      ),
    },
    "|",
    {
      name: "link",
      action: SimpleMDE.drawLink,
      className: styles.iconLink,
      title: getMessage("framework-markdownEditor-createLink", "Create Link"),
    },
    {
      name: "image",
      action: SimpleMDE.drawImage,
      className: styles.iconImage,
      title: getMessage("framework-markdownEditor-insertImage", "Insert Image"),
    },
    "|",
    {
      name: "preview",
      action: SimpleMDE.togglePreview,
      className: cn(styles.iconPreview, "no-disable"),
      title: getMessage(
        "framework-markdownEditor-togglePreview",
        "Toggle Preview"
      ),
    },
    {
      name: "side-by-side",
      action: SimpleMDE.toggleSideBySide,
      className: cn(styles.iconSideBySide, "no-disable"),
      title: getMessage(
        "framework-markdownEditor-toggleSideBySide",
        "Toggle Side by Side"
      ),
    },
    {
      name: "fullscreen",
      action: SimpleMDE.toggleFullScreen,
      className: cn(styles.iconFullscreen, "no-disable"),
      title: getMessage(
        "framework-markdownEditor-toggleFullscreen",
        "Toggle Fullscreen"
      ),
    },
    "|",
    {
      name: "guide",
      action: "https://simplemde.com/markdown-guide",
      className: styles.iconGuide,
      title: getMessage(
        "framework-markdownEditor-markdownGuide",
        "Markdown Guide"
      ),
    },
  ];

  const config = {
    status: false,

    // Do not download fontAwesome icons as we replace them with
    // material icons.
    autoDownloadFontAwesome: false,

    // Disable built-in spell checker as it is very rudimentary.
    spellChecker: false,

    // filter out any toolbar items not included in props.toolbar array
    toolbar: toolbarDefault
      .filter((item) => {
        if (typeof item === "string") {
          return true;
        }
        return (toolbar || defaultToolbar).includes(item.name as ToolbarItem);
      })
      .filter((item, i, arr) => {
        // prevent duplicate dividers
        return item !== arr[i - 1];
      }),
  };

  const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
  const [editor, setEditor] = useState<SimpleMDE | null>(null);

  const onRef = (ref: HTMLTextAreaElement) => {
    if (ref) {
      setTextarea(ref);
    }
  };

  useEffect(() => {
    if (textarea) {
      const editorSetup = new SimpleMDE({
        ...config,
        element: textarea,
        autofocus: autoFocus,
      });
      // Don't trap the key, to stay accessible.
      editorSetup.codemirror.options.extraKeys.Tab = false;
      editorSetup.codemirror.options.extraKeys["Shift-Tab"] = false;

      editorSetup.codemirror.on("change", () => {
        onChange(editorSetup.value());
      });
      setEditor(editorSetup);
    }
  }, [textarea]);

  useEffect(() => {
    // Remove mde on dismount
    return () => {
      if (editor) {
        editor.toTextArea();
      }
    };
  }, []);

  useEffect(() => {
    if (editor) {
      if (value !== editor.value()) {
        editor.value(value);
      }
    }
  }, [value, editor]);

  useEffect(() => {
    // Workaround empty render issue.
    // https://github.com/NextStepWebs/simplemde-markdown-editor/issues/313
    if (editor) {
      editor.codemirror.refresh();
    }
  }, [id, name, getMessage, onChange, value, toolbar, editor]);

  // This is for accessibility purposes.
  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea ref={onRef} {...rest} onChange={(e) => onTextAreaChange(e)} />
    </div>
  );
};

let markdownEditor = MarkdownEditor;

if (process.env.NODE_ENV === "test") {
  // Replace with simple texteditor because it won't work in a jsdom environment.
  markdownEditor = function MarkdownEditorTest({ onChange, ...rest }) {
    return (
      <div className={styles.wrapper}>
        <textarea
          {...rest}
          onChange={(e: ChangeEvent<HTMLTextAreaElement> | string) => {
            if (onChange) {
              onChange(typeof e === "string" ? e : e.target.value);
            }
          }}
        />
      </div>
    );
  } as React.FunctionComponent<PropTypesOf<typeof markdownEditor>> as any;
}

export default markdownEditor;
