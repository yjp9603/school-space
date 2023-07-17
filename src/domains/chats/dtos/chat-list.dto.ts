import { RoleType } from 'src/domains/spaces/constants/constants';
import { Chat } from '../entities/chat.entity';

export class ChatListDto {
  id: number;
  content: string;
  isAnonymous: boolean;
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
  user: { id: number; name: string };

  constructor(chat: Chat, userId: number, roleType: RoleType) {
    this.id = chat.id;
    this.content = chat.content;
    this.isAnonymous = chat.isAnonymous;
    this.parentId = chat.parentId;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
    this.user = {
      id: chat.author.id,
      name: chat.requiredAnonymousUserName(userId, roleType)
        ? '익명'
        : `${chat.author.name.firstName} ${chat.author.name.lastName}`,
    };
  }
}
