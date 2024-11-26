import React, { createContext, useState, ReactNode } from 'react';
import { ConversationContextType } from '../interfaces/Chatbot';

// Tạo ngữ cảnh với giá trị mặc định là undefined
const ConversationContext = createContext<ConversationContextType>({
    conversationId: "",
    setConversationId: () => {}
});

// Định nghĩa một thành phần để bao bọc các thành phần con
const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversationId, setConversationId] = useState<string>("");
  
    return (
      <ConversationContext.Provider value={{ conversationId, setConversationId }}>
        {children}
      </ConversationContext.Provider>
    );
  };
  
export { ConversationContext, ConversationProvider };
  
