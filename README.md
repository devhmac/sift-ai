This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Tech Stack

- Typescript
- NextJS
- Tailwindcss
- Shadcn
  -tRPC -- wrapper over tanstack

  prisma - database wrapper

  - reg nextjs front and back split, fetch from front end sends request to backend, which will process, then send it back to us

    - problem, in typescript the type will be "any", not typesafe, dont know what to expect at scale

  - planetscale as db provider

  ### Chat Optimistic Updates

  when sending message that needs to hit database, immedately update state before confirming the api route has finished

  ### Infinite Queries - like infinite scroll

  navigate to page with 100 messages, if we dont have this we would render all messages, even those hidden above. Not great because we dont need them rendered. Only load last X messages, then if they scroll up load more.

Why Chat wrapper - handles all loading states, need context from all inputs, layout control

Learning Prisma notes, once you make local changes need db prisma push,then npx prisma generate

### semantic query

Every text with AI languange model can be turned into a vector.

need to index and vector PDF
