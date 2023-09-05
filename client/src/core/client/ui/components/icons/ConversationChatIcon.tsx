import React, { FunctionComponent } from "react";

const ConversationChatIcon: FunctionComponent = () => {
  // https://www.streamlinehq.com/icons/streamline-regular/messages-chat-smileys/conversation/conversation-chat
  return (
    <svg viewBox="-0.25 -0.25 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.75,8.25h-12l-4.5,4.5V8.25h-3a1.5,1.5,0,0,1-1.5-1.5V2.25A1.5,1.5,0,0,1,2.25.75h19.5a1.5,1.5,0,0,1,1.5,1.5v4.5A1.5,1.5,0,0,1,21.75,8.25Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M2.25,11.25a1.5,1.5,0,0,0-1.5,1.5v4.5a1.5,1.5,0,0,0,1.5,1.5h12l4.5,4.5v-4.5h3a1.5,1.5,0,0,0,1.5-1.5v-4.5a1.5,1.5,0,0,0-1.5-1.5H11.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default ConversationChatIcon;
