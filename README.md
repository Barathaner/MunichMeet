# MunichMeet

Welcome to MunichMeet!

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and hosted by a Python Flask server.


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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Hosting locally

### Clone the repo and go into it


```bash
git clone https://github.com/Barathaner/MunichMeet.git
cd MunichMeet
```

### Build and export the frontend as static website for the server

```bash
cd frontent/munichmeet
npm install
npm run build
npm run export
```

Now you should see a new directory, called "out". It contains the static website that we want to host.

### Final hosting

```bash
# Go back to the top of our repo
cd ../..

# Move "out" directory into the backend
mv -r frontend/munichmeet/out backend

# Launch the Flask server
python3 server.py
```

Now, you can try it out by opening the webbrowser of your choice on the same machine, and enter ```localhost:3000```.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
