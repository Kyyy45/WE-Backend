export const getEnv = (key: string, fallback?: string): string => {
  const val = process.env[key];
  if ((val === undefined || val === '') && fallback === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return val ?? fallback!;
};
