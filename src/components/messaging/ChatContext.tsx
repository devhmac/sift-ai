import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/app/config/infinite-query";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //gives access to helperfunctions on your routes
  const utils = trpc.useContext();

  const { toast } = useToast();
  const backupMessage = useRef("");
  //not using TRPC because we want to stream back the JSON response, TRPC doesnt use json

  //making post request
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onMutate: async () => {
      //saving current message so we have it in case upload failure
      backupMessage.current = message;
      setMessage("");

      // first - pause getting messages
      await utils.getFileMessages.cancel();

      //then get previous messages
      const previousMessages = utils.getFileMessages.getInfiniteData();

      //
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              //reactquery handles the infinite data hook and needs these objects
              pages: [],
              pageParams: [],
            };
          }
          // getting the pages of messages
          let newPages = [...old.pages];
          // grab first item in array which contains the latest 10 messages in chat
          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
          ];
        }
      );
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
