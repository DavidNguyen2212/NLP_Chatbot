import React, { useContext, useState } from 'react';
import axios from 'axios';
import ChatBot, { Flow } from 'react-chatbotify';
import { ApiResponse, ConversationContextType, NewConversationResponse } from '../interfaces/Chatbot';
import { ConversationContext } from '../contexts/CurrentChat';
import { useNavigate } from 'react-router-dom';

const MyChatBot: React.FC = () => {
  const [llmResponse, setLlmResponse] = useState<string>('ok');
  const [llmState, setLlmState] = useState<string>('');
  const { conversationId, setConversationId } = useContext<ConversationContextType>(ConversationContext);
  const navigate = useNavigate();

  // Hàm để lấy dữ liệu từ API
  const fetchConversationId = async () => {
    try {
      const response = await axios.post<NewConversationResponse>('http://localhost:3000/chat/new-chat');
      setConversationId(response.data.conversationId);
      return response.data.conversationId;
    } catch (error) {
      console.log('Error fetching data:', error);
      setLlmResponse('Error loading data');
    }
  };

  const fetchData = async (question: string, conv_id: string) => {
    try {
      const response = await axios.post<ApiResponse>(
        `http://localhost:3000/chat/${conv_id}`,
        { new_message: question }
      );
      console.log('The id: ', conv_id);
      console.log('Response: ', response.data);

      setLlmResponse(response.data.data);
      setLlmState(response.data.message);
    } catch (error) {
      console.log('Error fetching data:', error);
      setLlmResponse('Error loading data');
    }
  };

  // Flow để nhận đầu vào từ người dùng và gọi API
  const flow: Flow = {
    start: {
      message: 'Chào mừng đến Agoda 🥳! Bạn cần tìm gì hôm nay?',
      function: async (params) => {
        const newConvId = await fetchConversationId();
        if (newConvId) {
          await fetchData(params.userInput, newConvId);
          navigate(`/chat/${newConvId}`);
        }
      },
      path: 'loop',
    },
    loop: {
      function: async (params) => {
        await fetchData(params.userInput, conversationId);
      },
      message: () => {
        if (llmState !== 'Continue chat') {
          // Điều hướng về trang chủ sau 5 giây
          setTimeout(() => {
            navigate('/');
            window.location.reload();
          }, 5000);

          // Loại bỏ chuỗi "finish_conversation" và trả về phần còn lại
          return llmResponse.replace('`finish_conversation`', '').trim();
        }

        return llmResponse;
      },
      path: 'loop',
    },
  };

  return <ChatBot flow={flow} />;
};

export default MyChatBot;
