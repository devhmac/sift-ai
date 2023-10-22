interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { fileid } = params;

  return <div>{fileid}</div>;
};

export default Page;
