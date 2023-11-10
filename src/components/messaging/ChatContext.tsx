import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/app/config/infinite-query";
import { DatabaseIcon } from "lucide-react";

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
    onMutate: async ({ message }) => {
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
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;
          return {
            ...old,
            pages: newPages,
          };
        }
      );
      setIsLoading(true);
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      // this will contain a readable stream from the api
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a Problem sending your message",
          description: "Please reload the page and try again",
          variant: "destructive",
        });
      }

      const streamReader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // need an accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await streamReader.read();
        done = doneReading;
        const chunk = decoder.decode(value);

        accResponse += chunk;

        // need to add chunk to the actual chat message state
        utils.getFileMessages.setInfiniteData(
          {
            fileId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response")
            );

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;
                if (!isAiResponseCreated) {
                  // no response exists yet, creating new message object with AI response with chunked response piping into first position
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  //ai response already exists
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }
                    return message;
                  });
                }
                return {
                  ...page,
                  messages: updatedMessages,
                };
              }
              return page;
            });
            return { ...old, pages: updatedPages };
          }
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      // invalidate file state so it will refresh all messages
      await utils.getFileMessages.invalidate({ fileId });
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
