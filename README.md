<div align="center">

# .Sift-AI

### A Full-Stack AI Powered Document Interpreter

Allowing Artificial inteligence to extract information and insights from uploaded PDF documents in real-time, based on your questions and converstaion.

</div>
<br>

## Tech Stack

### FrontEnd

- Typescript
- NextJS
- Tailwindcss
- Shadcn

### Backend

- Planetscale PostGres Database
- Pinecone DB Vector Database
- Prisma ORM
- Tanstack & tRPC
- LangChain - parsing and enabling the vectorization of your document for LLM Context

### APIs and Helpers

- Kinde Authentication
- OpenAI: GPT-3 LLM
- Uploadthing - AWS S3 document upload abstraction layer

### Landing Page

---

![sift-ai-landing](public/readmeGifs/sift-ai-landing.gif)

### Streamed AI responses

---

![Streamed AI Response](/public/readmeGifs/ai-response.gif)

---

|                Upload PDF's                 |        Manage, view and delete files        |
| :-----------------------------------------: | :-----------------------------------------: |
| ![Dashboard](/public/readmeGifs/Upload.gif) | ![upload](/public/readmeGifs/dashboard.gif) |

|             PDF reader functionality             |                     Infinite message rendering                      |
| :----------------------------------------------: | :-----------------------------------------------------------------: |
| ![PDF](/public/readmeGifs/pdf-functionality.gif) | ![Infinite Scroll](/public/readmeGifs/infinite-message-queries.gif) |

## Techniques and Notables

### NextJS Server Components

Experimenting with NextJS server components and routes.

### Optimistic Chat Updates

Update state immediately upon a message being sent for maxium responsiveness and user experience. If there is an error in the message endpoint, or a failure loging to the db, rollback the state, saving the initial message condition so the user can immediately try again.

### Streamed AI Responses

AI responses can be slow to complete. Instead of waiting for the full response to finish, it is streamed into the application in real time as it is being generated.

### Infinite Message Rendering

Your document conversations can be lengthy. Instead of rendering every single message when a document page is openned, only the first 10 messages and queried. Using a rolling limit, as you scroll up your chat window, previous messages are automatically rendered in as needed. Seamlessly increasing performance without interruping user needs.

### Authentication

Utilizing Kinde Auth for full Sign-in/sign-up account creating. Keeping your documents private and secure.

## Try It out yourself

First clone the git repo locally

```bash
git clone git@github.com:devhmac/sift-ai.git
```

Install Dependencies

```bash
npm install
```

Environment Variables

- Refer to the exampleenv for required API and Library keys

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser
