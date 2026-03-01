export const APP_NAME = "AgentRadar";

// Empty string means requests are proxied via Vite dev server proxy to localhost:8000
// In production this should be set to the actual API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
