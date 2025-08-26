import z from "zod";

export const mvpStatsSchema = z.array(
  z.object({
    statName: z.string().meta({ description: "The name of the statistic" }),
    sum: z
      .number()
      .nonnegative()
      .meta({ description: "Total of the stat for the whole session" }),
    average: z
      .number()
      .nonnegative()
      .optional()
      .meta({ description: "Average of the stat for the whole session" }),
  }),
);

export const mvpSchema = z.object({
  player: z.string(),
  description: z.string(),
  stats: mvpStatsSchema,
});

export type MvpOutput = z.infer<typeof mvpSchema>;
