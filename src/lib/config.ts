interface Config {
  YOUTUBE_API_KEY: string | undefined;
  YOUTUBE_LOCAL_API_KEY: string | undefined;
  NEXT_PUBLIC_POSTHOG_KEY: string | undefined;
  NEXT_PUBLIC_POSTHOG_HOST: string | undefined;
}

const getConfig = (): Config => {
  return {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_LOCAL_API_KEY: process.env.YOUTUBE_LOCAL_API_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  };
};

const getSanitizedConfig = (
  config: Config,
): { [key in keyof typeof config]: string } => {
  for (const [key, val] of Object.entries(config)) {
    // if (val === undefined) throw new Error(`Missing key ${key} in .env`);
  }
  const c = { ...config } as unknown;
  return c as { [key in keyof typeof config]: string };
};

const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;