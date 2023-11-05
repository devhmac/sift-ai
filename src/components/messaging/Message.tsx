import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Bot, User } from "lucide-react";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = ({ message, isNextMessageSamePerson }: MessageProps) => {
  return (
    <div
      className={cn("flex items-end", { "justify-end": message.isUserMessage })}
    >
      <div
        className={cn(
          "relative flex h-6 w-6 aspect-square items-center justify-center",
          {
            "order-2 bg-green-600 rounded-sm": message.isUserMessage,
            "order-1 bg-zinc-600 rounded-sm": !message.isUserMessage,
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {message.isUserMessage ? (
          <User className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
        ) : (
          <Bot className="fill-zinc-300 h-3/4 w-3/4" />
        )}
      </div>
      {message.text}
    </div>
  );
};

export default Message;
