export const logApiEvent = (event: string, details: Record<string, unknown> = {}) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ...details,
  }));
};
