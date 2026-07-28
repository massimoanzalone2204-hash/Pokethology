export interface ChatMessage {
  text: string;
}

export const shareToGoogleChat = async (accessToken: string, message: string) => {
  // We need a space ID to post to. Since we don't have a space selector, 
  // we'll ask the user to provide a space name or use a default if they are in one.
  // For this app, we'll try to list spaces first or just use a placeholder if they need to provide one.
  
  try {
    // 1. List spaces to find a room to post to
    const spacesRes = await fetch('https://chat.googleapis.com/v1/spaces', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!spacesRes.ok) {
      throw new Error('Failed to fetch Google Chat spaces');
    }
    
    const { spaces } = await spacesRes.json();
    
    if (!spaces || spaces.length === 0) {
      throw new Error('No Google Chat spaces found. Please join a space first.');
    }
    
    // Pick the first available space for simplicity in this demo
    const spaceId = spaces[0].name;
    
    // 2. Post message
    const postRes = await fetch(`https://chat.googleapis.com/v1/${spaceId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: message })
    });
    
    if (!postRes.ok) {
      const errorData = await postRes.json();
      throw new Error(errorData.error?.message || 'Failed to post message to Google Chat');
    }
    
    return await postRes.json();
  } catch (error) {
    console.error('Google Chat Error:', error);
    throw error;
  }
};
