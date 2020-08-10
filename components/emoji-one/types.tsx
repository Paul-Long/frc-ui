export interface EmojiType {
  emo: string;
  type: string;
  isDelete: boolean;
}

export interface UploadType {
  key: string;
  files: Array<File>;
}
