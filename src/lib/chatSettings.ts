export const getCustomApiKey = () => localStorage.getItem("custom_gemini_api_key") || "";
export const setCustomApiKey = (key: string) => {
  if (!key.trim()) {
    localStorage.removeItem("custom_gemini_api_key");
  } else {
    localStorage.setItem("custom_gemini_api_key", key.trim());
  }
};

export const getChatEngine = (): 'gemini' | 'local' => {
  return 'gemini';
};

export const setChatEngine = (mode: 'gemini' | 'local') => {
  localStorage.setItem("chat_engine_mode", mode);
};
