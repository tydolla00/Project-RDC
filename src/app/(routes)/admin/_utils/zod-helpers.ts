import { z, ZodTypeAny } from "zod";

/**
 * Creates a Zod validation pipeline for transforming string inputs into numbers
 *
 * @description
 * This pipeline:
 * 1. Ensures non-empty input strings
 * 2. Handles empty strings by converting to null
 * 3. Validates numeric values
 * 4. Converts valid strings to numbers
 * 5. Pipes the result through additional Zod validation
 *
 * @param zodPipe - Additional Zod validation to apply after the base transformations
 * @returns A Zod transformation pipeline
 * @throws Validation error if input is empty or non-numeric
 */
export const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .min(1, "Stat value is required")
    .transform((value) => (value === "" ? null : value))
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: "Should be a number",
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe);
