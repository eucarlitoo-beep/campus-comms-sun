export type RoomType = "channel" | "dm";

export interface ChatUser {
  id: string;
  name: string;
  avatarColor: string;
  online: boolean;
  lastSeen: number;
}

export interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberIds: string[];
  createdAt: number;
}

export interface Dm {
  id: string;
  memberIds: [string, string] | string[];
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  roomType: RoomType;
  authorId: string;
  text: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  parentId: string | null;
  replyCount?: number;
  lastReplyAt?: number;
  mentions: string[];
  createdAt: number;
  editedAt: number | null;
  reactions: Record<string, string[]>;
  readBy: string[];
}

export interface TypingEvent {
  roomId: string;
  roomType: RoomType;
  userId: string;
  name?: string;
  typing: boolean;
}

export interface Notification {
  type: "mention";
  message: ChatMessage;
}

export interface ActiveRoom {
  id: string;
  type: RoomType;
  /** Display label — channel name (#nome) or the other participant's name. */
  label: string;
}
