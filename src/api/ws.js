
export const sendMessage = (ws, recipient, text) => {
    const payload = { type: "direct", recipient, text };
    ws.send(JSON.stringify(payload));
  };
  
  export const sendTypingStatus = (ws, recipient, status) => {
    const payload = { type: "typing", recipient, status };
    ws.send(JSON.stringify(payload));
  };
  
  export const sendReadReceipt = (ws, messageId) => {
    const payload = { type: "readReceipt", messageId };
    ws.send(JSON.stringify(payload));
  };