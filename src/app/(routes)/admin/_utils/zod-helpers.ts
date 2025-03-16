import { z, ZodTypeAny } from "zod";

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
