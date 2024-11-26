import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { Chat, LLM_response, SuccessResponse } from '@/interfaces/chats.interface';
import { ChatModel } from '@/models/chats.model';
import { ChatUserDto } from '@/dtos/chats.dto';

@Service()
export class ChatService {
  public async findAllConversations(): Promise<Chat[]> {
    const chats: Chat[] = await ChatModel.find();
    return chats;
  }

  public async createNewConversation(): Promise<Chat> {
    try {
      // Tạo một document mới với dữ liệu mặc định hoặc tuỳ chỉnh
      const newChat = new ChatModel({
        memory: "Sample memory", // Giá trị ban đầu cho memory, nếu cần tuỳ chỉnh có thể sửa
        conversations: [], // Conversations bắt đầu với một mảng rỗng
      });
      // Trả về document đã được lưu
      return await newChat.save()
    } catch (error) {
      console.error('Error creating new conversation:', error);
      throw new Error('Failed to create a new conversation');
    }
  }

  public async updateConversation(chatId: string, userData: ChatUserDto, reply_from_LLM: SuccessResponse): Promise<Chat> {
    const chat = await ChatModel.findById(chatId)
    if (!chat)
      throw new HttpException(409, `This conversation ID: ${chatId} does not exist`);

    chat.conversations.push([userData.new_message, reply_from_LLM.response])
    // const update_conversation_byID = await ChatModel

    return await chat.save();
  }

}
