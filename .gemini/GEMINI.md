# Project: Project RDC

## General Instructions:

- This is mainly a typescript react project.
- Be sure to not introduce any new bugs or type errors when altering previous codes.
- Any new functions should contains JSDoc's detailing their purpose, parameters, and return type.
- Any single statement if/fn/loop statements should not use brackets. For example

```tsx
let bool = true;
let num = 0;

if (bool) num = 10;
else num = -10;
```

## DB Context

- The import for the db context lives in prisma/db.ts. Anytime you fetch from the db use this import.
- Be mindful of errors that may occur when fetching or performing mutations on the db.
- The schema for the db lives in prisma/schema.prisma. Whenever performing mutations or fetches on the db make sure the properties exist in the schema and is valid prisma syntax.
