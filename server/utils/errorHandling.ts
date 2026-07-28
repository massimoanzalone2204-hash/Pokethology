export function handleApiError(error: any, res: any, contextDescription: string) {
  console.error(`[Error] ${contextDescription}:`, error);
  const status = error.status || 500;
  const message = error.message || "An unexpected error occurred.";
  res.status(status).json({ success: false, error: message });
}
