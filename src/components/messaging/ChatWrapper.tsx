"use client";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { Loader2, XCircle } from "lucide-react";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  console.log(fileId);

  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-zinc-500 text-sm">Getting you set up</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            <h3 className="font-semibold text-xl">Processing your interface</h3>
            <p className="text-zinc-500 text-sm">almost ready</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-600 animate-spin" />
            <h3 className="font-semibold text-xl">
              Your PDF has too many pages
            </h3>
            <p className="text-zinc-500 text-sm">
              The <span className="font-medium">Free</span> tier only supports
              up to 10 pages.
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
