import { model, Schema, Document } from 'mongoose';
import { Chat } from '@interfaces/chats.interface';

const ChatSchema: Schema = new Schema({
  memory: {
    type: String,
    required: false,
  },
  conversations: [
    {
      type: [String], // Mỗi phần tử là một mảng gồm hai chuỗi
      validate: {
        validator: function (arr: string[]) {
          return arr.length === 2; // Xác thực rằng mảng phải có đúng hai phần tử
        },
        message: 'Each conversation must have exactly two strings.',
      },
    },
  ],
});

export const ChatModel = model<Chat & Document>('Chat', ChatSchema);
