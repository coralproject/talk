import cn from "classnames";
import React, { ChangeEvent, Component, Ref } from "react";
import SimpleMDE from "simplemde";

import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import { PropTypesOf } from "coral-ui/types";

import styles from "./MarkdownEditor.css";

interface Props {
  id?: string;
  name?: string;
  getMessage: GetMessage;
  onChange: (value: string) => void;
  value: string;
}

class MarkdownEditor extends Component<Props> {
  private config = {
    status: false,

    // Do not download fontAwesome icons as we replace them with
    // material icons.
    autoDownloadFontAwesome: false,

    // Disable built-in spell checker as it is very rudimentary.
    spellChecker: false,

    toolbar: [
      {
        name: "bold",
        action: SimpleMDE.toggleBold,
        className: styles.iconBold,
        title: this.props.getMessage("framework-markdownEditor-bold", "Bold"),
      },
      {
        name: "italic",
        action: SimpleMDE.toggleItalic,
        className: styles.iconItalic,
        title: this.props.getMessage(
          "framework-markdownEditor-italic",
          "Italic"
        ),
      },
      {
        name: "title",
        action: SimpleMDE.toggleHeadingSmaller,
        className: styles.iconTitle,
        title: this.props.getMessage(
          "framework-markdownEditor-titleSubtitleHeading",
          "Title, Subtitle, Heading"
        ),
      },
      "|",
      {
        name: "quote",
        action: SimpleMDE.toggleBlockquote,
        className: styles.iconQuote,
        title: this.props.getMessage("framework-markdownEditor-quote", "Quote"),
      },
      {
        name: "unordered-list",
        action: SimpleMDE.toggleUnorderedList,
        className: styles.iconUnorderedList,
        title: this.props.getMessage(
          "framework-markdownEditor-genericList",
          "Generic List"
        ),
      },
      {
        name: "ordered-list",
        action: SimpleMDE.toggleOrderedList,
        className: styles.iconOrderedList,
        title: this.props.getMessage(
          "framework-markdownEditor-numberedList",
          "Numbered List"
        ),
      },
      "|",
      {
        name: "link",
        action: SimpleMDE.drawLink,
        className: styles.iconLink,
        title: this.props.getMessage(
          "framework-markdownEditor-createLink",
          "Create Link"
        ),
      },
      {
        name: "image",
        action: SimpleMDE.drawImage,
        className: styles.iconImage,
        title: this.props.getMessage(
          "framework-markdownEditor-insertImage",
          "Insert Image"
        ),
      },
      "|",
      {
        name: "preview",
        action: SimpleMDE.togglePreview,
        className: cn(styles.iconPreview, "no-disable"),
        title: this.props.getMessage(
          "framework-markdownEditor-togglePreview",
          "Toggle Preview"
        ),
      },
      {
        name: "side-by-side",
        action: SimpleMDE.toggleSideBySide,
        className: cn(styles.iconSideBySide, "no-disable"),
        title: this.props.getMessage(
          "framework-markdownEditor-toggleSideBySide",
          "Toggle Side by Side"
        ),
      },
      {
        name: "fullscreen",
        action: SimpleMDE.toggleFullScreen,
        className: cn(styles.iconFullscreen, "no-disable"),
        title: this.props.getMessage(
          "framework-markdownEditor-toggleFullscreen",
          "Toggle Fullscreen"
        ),
      },
      "|",
      {
        name: "guide",
        action: "https://simplemde.com/markdown-guide",
        className: styles.iconGuide,
        title: this.props.getMessage(
          "framework-markdownEditor-markdownGuide",
          "Markdown Guide"
        ),
      },
    ],
  };
  public textarea: HTMLTextAreaElement | null = null;
  public editor: SimpleMDE | null = null;

  public onRef: Ref<HTMLTextAreaElement> = (ref) => (this.textarea = ref);

  public componentDidMount() {
    this.editor = new SimpleMDE({
      ...this.config,
      element: this.textarea!,
    });

    // Don't trap the key, to stay accessible.
    this.editor.codemirror.options.extraKeys.Tab = false;
    this.editor.codemirror.options.extraKeys["Shift-Tab"] = false;

    this.editor.codemirror.on("change", this.onChange);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.value !== nextProps.value &&
      nextProps.value !== this.editor!.value()
    ) {
      this.editor!.value(nextProps.value);
    }
  }

  public componentDidUpdate() {
    // Workaround empty render issue.
    // https://github.com/NextStepWebs/simplemde-markdown-editor/issues/313
    this.editor!.codemirror.refresh();
  }

  public componentWillUnmount() {
    this.editor!.toTextArea();
  }

  private onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.editor!.value());
    }
  };

  // This is for accessibility purposes.
  private onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  public render() {
    const { getMessage: _g, ...rest } = this.props;
    return (
      <div className={styles.wrapper}>
        <textarea ref={this.onRef} {...rest} onChange={this.onTextAreaChange} />
      </div>
    );
  }
}

let enhanced = withGetMessage(MarkdownEditor);

if (process.env.NODE_ENV === "test") {
  // Replace with simple texteditor because it won't work in a jsdom environment.
  enhanced = (function MarkdownEditorTest({ onChange, ...rest }) {
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
  } as React.FunctionComponent<PropTypesOf<typeof enhanced>>) as any;
}

export default enhanced;
