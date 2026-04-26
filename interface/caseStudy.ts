export type BlockType = "text" | "image" | "media" | "embed";

export type TextVariant = "paragraph" | "heading";
export type TextAlign = "left" | "center" | "right";

export interface TextBlockStyle {
  variant?: TextVariant;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: TextAlign;
  link?: string;
}

export interface ImageBlockStyle {
  fit?: "cover" | "contain";
  cloudinaryPublicId?: string;
}

export interface MediaBlockStyle {
  height?: number;
  cloudinaryPublicId?: string;
}

export interface EmbedBlockStyle {
  height?: number;
}

export interface CaseStudyBlock {
  id: number;
  type: BlockType;
  content: string;
  textStyle?: TextBlockStyle;
  imageStyle?: ImageBlockStyle;
  mediaStyle?: MediaBlockStyle;
  embedStyle?: EmbedBlockStyle;
}

export type CaseStudyStatus = "draft" | "published";

export interface CaseStudyPayload {
  title: string;
  blocks: CaseStudyBlock[];
}

export interface CaseStudyDocument extends CaseStudyPayload {
  id: string;
  userId: string;
  status: CaseStudyStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
  publishedAt?: unknown;
}
