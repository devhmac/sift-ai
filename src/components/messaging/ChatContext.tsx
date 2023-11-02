import { ReactNode, createContext } from "react";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputCHange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: props) => {};
