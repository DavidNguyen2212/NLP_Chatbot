import { ObjectId } from "mongoose";

export interface Chat {
  _id?: ObjectId; // _id cuộc trò chuyện
  memory?: string; // memory (ký ức)
  conversations: [string, string][]; // chuỗi hội thoại đang xảy ra
}

export interface SuccessResponse {
  response: string;
  message: string;
}

export type LLM_response = Error | SuccessResponse;
