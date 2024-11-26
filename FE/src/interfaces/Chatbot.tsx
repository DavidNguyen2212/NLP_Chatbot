// Định nghĩa kiểu dữ liệu trả về từ API (cập nhật kiểu này dựa trên cấu trúc dữ liệu của bạn)
export interface ApiResponse {
  data: string;
  message: string;
}

export interface NewConversationResponse {
  conversationId: string
  message: string;
}



// Xác định kiểu dữ liệu cho ngữ cảnh
export interface ConversationContextType {
  conversationId: string;
  setConversationId: (input: string) => void;
}