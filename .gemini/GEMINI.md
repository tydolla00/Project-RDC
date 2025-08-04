# Project: Project RDC

This document provides essential context and guidelines for working on Project RDC. Adhering to these conventions ensures consistency and smooth development.

## General Instructions

- **Framework:** This is a [Next.js](https://nextjs.org/) project using TypeScript and React.
- **Development Server:** To run the development server, use the following command:
  ```bash
  npm run dev
  ```
- **Code Style:**

  - Do not introduce new bugs or type errors.
  - All new functions must have JSDoc comments detailing their purpose, parameters, and return type.
  - Use single-statement if/else/loops without brackets for brevity.

    ```tsx
    let bool = true;
    let num = 0;

    if (bool) num = 10;
    else num = -10;
    ```

## Scripts

The `package.json` file contains the following scripts:

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run postinstall`: Generates Prisma client after an install.
- `npm run build`: Creates a production build of the application.
- `npm run build-memory`: Creates a production build with experimental memory usage debugging.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.

## General Knowledge

The path aliases for the project live in the components.json file.

## Key Dependencies

- **UI:**
  - [React](https://react.dev/): The core UI library.
  - [Next.js](https://nextjs.org/): The React framework for production.
  - [Tailwind CSS](https://tailwindcss.com/): For styling.
  - [shadcn/ui](https://ui.shadcn.com/): A collection of re-usable UI components.
  - [Recharts](https://recharts.org/): For creating charts.
- **Forms:**
  - [React Hook Form](https://react-hook-form.com/): For managing forms.
  - [Zod](https://zod.dev/): For data validation.
- **Authentication:**
  - [NextAuth.js](https://next-auth.js.org/): For handling authentication.
- **Database:**
  - [Prisma](https://www.prisma.io/): The ORM for interacting with the database.
  - [Neon](https://neon.tech/): Serverless Postgres database.

## DB Context

- **Prisma Client:** The Prisma client is your primary interface to the database. Import it from `prisma/db.ts`.
- **Schema:** The database schema is defined in `prisma/schema.prisma`. Before performing any database operations, ensure that the properties you are accessing are defined in the schema and that your queries adhere to valid Prisma syntax.
- **Migrations:** Database migrations are managed by Prisma. To create a new migration, use the `prisma migrate dev` command.
- **Seeding:** The database can be seeded with initial data by running `npx prisma db seed`. The seed script is located at `prisma/seed.ts`.
