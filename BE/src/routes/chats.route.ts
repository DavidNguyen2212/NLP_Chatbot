import { Router } from 'express';
import { ChatController } from '@controllers/chats.controller';
import { ChatUserDto } from '@dtos/chats.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class ChatRoute implements Routes {
  public path = '/chat';
  public router = Router();
  public chat = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.chat.getChats);
    this.router.post(`${this.path}/new-chat`, this.chat.createNewChat);
    this.router.post(`${this.path}/create-index`, this.chat.createLocalIndex);
    this.router.post(`${this.path}/:id`, ValidationMiddleware(ChatUserDto), this.chat.createReplyMsg);
  }
}
