import cn from "classnames";
import noop from "lodash/noop";
import React, { Component, Ref } from "react";
import SimpleMDE from "simplemde";

import { GetMessage, withGetMessage } from "talk-framework/lib/i18n";

import styles from "./MarkdownEditor.css";

interface Props {
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

  public onRef: Ref<HTMLTextAreaElement> = ref => (this.textarea = ref);

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

  public componentWillReceiveProps(nextProps: Props) {
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

  public onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.editor!.value());
    }
  };

  public render() {
    const { getMessage: _g, ...rest } = this.props;
    return (
      <div className={styles.wrapper}>
        <textarea ref={this.onRef} {...rest} onChange={noop} />
      </div>
    );
  }
}

const enhanced = withGetMessage(MarkdownEditor);
export default enhanced;
