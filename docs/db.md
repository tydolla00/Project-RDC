# Database Reset & Migration Guide

## Exporting Sessions

1. Grab all sessions, conforming to the `EnrichedSession` type.
2. Save them as a JSON file for use in the seed script.

## Running Migrations

To create a new migration, run:

```bash
npx prisma migrate dev --name <name-of-migration>
```

If prompted to reset the database, you can run:

```bash
npx prisma migrate reset
```

This will reset the database and then run the seed script.

## Skipping Migrations

You can skip the migration process and push schema changes directly:

```bash
npx prisma db push
```

If allowed, this will apply the changes to your database.

## Seeding the Database

Running the following will reset the database and run the seed script in `prisma/seed.ts`:

```bash
npx prisma migrate reset
```

## Importing Sessions

Be sure to update the seed script to point to the JSON file where you have all the sessions stored, so they can be imported back into the database.
