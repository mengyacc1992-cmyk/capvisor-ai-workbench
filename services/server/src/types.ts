
export enum AppView {
  DECK = 'deck',
  TOPICS = 'topics',
  EDITOR = 'editor'
}

export enum FaceShape {
  SQUARE_ROUND = '方圆脸',
  DIAMOND = '菱形脸',
  LONG = '长脸',
  HEART = '心形脸',
  ROUND = '圆脸',
  SQUARE = '方脸'
}

export enum HatType {
  FISHERMAN = '渔夫帽',
  BASEBALL = '棒球帽',
  BERET = '贝雷帽',
  NEWSBOY = '报童帽',
  BEANIE = '冷帽',
  AVIATOR = '飞行帽',
  BALACLAVA = '巴拉克拉法帽',
  CLOCHE = '钟形帽',
  USHANKKA = '雷锋帽'
}

export interface ParameterState {
  origin: string[];
  scene: string[];
  faceShape: FaceShape;
  gender: '女' | '男';
  hatType: HatType;
  volume: number;
  depth: number;
}

export interface TopicCard {
  id: string;
  title: string;
  heat: number;
  summary: string;
}

export interface AssetCardData {
  id: string;
  logicType: '引入' | '痛点分析' | '美学原理' | '解决方案' | '产品种草';
  visualStatus: 'skeleton' | 'rendering' | 'done';
  visualLogic: string; // The "Visual Logic" (Chinese description)
  prompt: string;      // The "English Prompt" (AI Instruction)
  imageUrl?: string;
  headline: string;
  l1Knowledge: string;
  l2Knowledge: string;
  script: string;
  score?: number;
}

export interface KnowledgeItem {
  id: string;
  l1: string;
  l2: string;
  formula: string;
}
