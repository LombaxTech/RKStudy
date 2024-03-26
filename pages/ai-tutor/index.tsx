import axios from "axios";
import React, { useRef, useState } from "react";

export default function AITutor() {
  const [messages, setMessages] = useState<any>([]);
  const [text, setText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const lastMessageRef = useRef<any>(null);

  const sendMessage = async () => {
    setSendingMessage(true);

    try {
      let messagesParam = messages
        ? messages
        : [
            {
              role: "system",
              content:
                "You are a study tutor  who helps students by answering questions they have",
            },
          ];

      const newMessage = {
        content: text,
        role: "user",
      };

      messagesParam.push(newMessage);
      setMessages(messagesParam);
      // clean up message param for api call
      // messagesParam = messagesParam.map((m: any) => {
      //   return {
      //     content: m.content,
      //     role: m.role,
      //   };
      // });

      let res = await axios.post(`/api/ai-tutor-message`, {
        messages: messagesParam,
      });

      console.log(res.data);
      let { message } = res.data;
      setMessages((oldMessages: any) => [...oldMessages, message]);
      setSendingMessage(false);
      setText("");
      lastMessageRef.current?.scrollIntoView({ behaviour: "smooth" });
    } catch (error) {
      console.log(error);
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-2">
        {messages &&
          messages.map((message: any, i: number) => {
            const fromUser = message.role === "user";
            const fromApp = message.role === "assistant";

            if (message.role === "system") return null;

            return (
              // <div className="">message...</div>s
              <div
                className={`flex flex-col gap-2 chat ${
                  message.role === "user" ? "chat-start" : "chat-end"
                }`}
                key={i}
              >
                <div className={`p-2 chat-bubble  bg-blue-100 text-gray-800`}>
                  {message.content}
                </div>
              </div>
            );
          })}

        {sendingMessage && (
          <div className="chat chat-end">
            <div className="p-2 chat-bubble bg-blue-100 text-gray-800 flex justify-center items-center">
              <span className="loading loading-dots loading-xs"></span>
            </div>
          </div>
        )}

        <div className="" ref={lastMessageRef}></div>

        {messages.length === 0 ? <NoMessages /> : null}
      </div>
      <div className="w-full p-6 flex flex-col gap-2">
        {/* SEND MESSAGE */}
        <div className="flex justify-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter message..."
            type="text"
            className="p-2 outline-none border rounded-l-full w-1/2 pl-4 shadow-md"
          />
          <button
            onClick={sendMessage}
            disabled={!text || sendingMessage}
            className="btn btn-primary rounded-none rounded-r-full shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const NoMessages = () => (
  <div className="flex-1 flex flex-col gap-6 items-center">
    {/* IMAGE */}
    <img src={"./math.svg"} className="h-60" />
    <h1 className="text-4xl font-bold">Ask a question on any topic!</h1>
  </div>
);
