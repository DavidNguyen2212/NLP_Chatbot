import { IsString, IsNotEmpty } from 'class-validator';

export class ChatUserDto {
  @IsString()
  @IsNotEmpty()
  public new_message: string;
}

