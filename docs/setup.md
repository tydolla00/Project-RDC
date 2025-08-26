# Repository Setup Instructions

Follow these steps to set up the necessary environment variables for this repository.

## Environment Variables

This project requires three different environment files to be set up:

-   `.env`
-   `.env.development.local`
-   `.env.production.local`

### `.env`

This file is primarily used by Prisma and for the static site generation (SSG) build process. It should contain the following variables:

```bash
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_database_url"
NEXT_PUBLIC_POSTHOG_KEY="your_posthog_key"
NEXT_PUBLIC_POSTHOG_HOST="your_posthog_host"
```

**Important:** When debugging a local build, ensure the `DATABASE_URL` in this file matches the one in `.env.development.local`.

### `.env.development.local`

This file is used when running the application in development mode with `npm run dev`. It should contain all the necessary environment variables for full functionality.

```bash
# Add all required environment variables here
# Example:
# DATABASE_URL="your_dev_database_url"
# ... other variables
```

### `.env.production.local`

This file is used for production builds and when running the application with `npm run start`. The build process will load variables from both `.env` and `.env.production.local`, with variables in `.env.production.local` taking precedence.

```bash
# Add all required environment variables here
# Example:
# DATABASE_URL="your_prod_database_url"
# ... other variables
```