# Nonna & Rue's

A boutique e-commerce website built with Next.js, MongoDB, and Tailwind CSS.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/patricknavarre/nonnas.git
cd nonnas
```

Install the dependencies:

```bash
npm install
```

Create a `.env.local` file with required environment variables (see `.env.example` for reference).

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

The easiest way to deploy this app is to use [Vercel](https://vercel.com):

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the root of your project
4. Follow the prompts to link your GitHub repository

Alternatively, you can connect your GitHub repository directly through the Vercel dashboard for automatic deployments.

### Required Environment Variables

Make sure to add these environment variables to your Vercel project:

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: A secret key for NextAuth (run `openssl rand -base64 32` to generate one)
- `ADMIN_USERNAME`: Initial admin username
- `ADMIN_PASSWORD`: Initial admin password
- `ADMIN_EMAIL`: Admin email address

## Features

- Responsive design
- Admin dashboard for managing products and orders
- Settings management system
- User authentication
- Product catalog
- Shopping cart

## Tech Stack

- **Framework**: Next.js
- **Database**: MongoDB (via mongoose)
- **Authentication**: NextAuth.js
- **CSS**: Tailwind CSS
- **Deployment**: Vercel
- **State Management**: React Context API

## License

MIT
