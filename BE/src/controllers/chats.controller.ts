import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Chat, LLM_response } from '@/interfaces/chats.interface';
import { ChatService } from '@/services/chats.service';
import { ChatUserDto } from '@/dtos/chats.dto';
import path from 'path';
import { response_from_LLM } from '@/utils/RAG';
import { createIndexFromPdf } from '@/utils/createVectorIndex';


export class ChatController {
  public chat = Container.get(ChatService);

  public getChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allConversationData: Chat[] = await this.chat.findAllConversations();
      res.status(200).json({ data: allConversationData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createNewChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newChat: Chat = await this.chat.createNewConversation();
      res.status(200).json({ conversationId: newChat._id, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createLocalIndex = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const relative_path = "../data/Agoda.pdf"
      const exact_path = path.resolve(__dirname, relative_path);
      const result = await createIndexFromPdf(exact_path);
      res.status(200).json({ data: 'createIndex successfully', message: 'OK' });
    } catch (error) {
      next(error);
    }
  };

  public createReplyMsg = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatId: string = req.params.id;
      const userData: ChatUserDto = req.body;
      const saved_dir = path.resolve(__dirname, '../hf_indexes');
      const reply_from_LLM: LLM_response = await response_from_LLM(saved_dir, userData.new_message)

      if (reply_from_LLM instanceof Error)
        res.status(400).json({
          error_name: reply_from_LLM.name,
          error_msg: reply_from_LLM.message
        })
      else {
        const updateChat: Chat = await this.chat.updateConversation(chatId, userData, reply_from_LLM);
        res.status(200).json({
          data: reply_from_LLM.response,
          message: reply_from_LLM.message
        })
      }

    } catch (error) {
      next(error);
    }
  };

}
