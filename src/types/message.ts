// trpc magic automatically infering outputs from our endpoint

import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

// automatically infering output types of message from our get messages endpoint
type Messages = RouterOutput["getFileMessages"]["messages"];

// loading message is not string, its JSX, need to accomodate
// messages is array so use number to get just one, then omiting the text from it
// we are omitting because above it is only a string, but we want to allow for string or JSX
type OmitText = Omit<Messages[number], "text">;

// creating type for text element to enable string or jsx
type ExtendedText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;

// what we've done here is create a type object for messages with everything but text included, then created a custom text type, and added it together in the extended message type
