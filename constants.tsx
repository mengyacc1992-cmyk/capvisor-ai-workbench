
import { FaceShape, HatType, KnowledgeItem } from './types';

export const FACE_SHAPES = Object.values(FaceShape);
export const HAT_TYPES = Object.values(HatType);

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  { id: 'k1', l1: '视觉重心转移', l2: '增加颅顶高度', formula: '[高冠帽] + [上移重心] = [视觉延展面中]' },
  { id: 'k2', l1: '视错觉原理', l2: '对比肩宽', formula: '[大帽檐] + [对比肩宽] = [显脸小]' },
  { id: 'k3', l1: '骨相分析', l2: '修饰颧骨外扩', formula: '[软檐渔夫帽] + [遮蔽线条] = [柔化面部边缘]' },
  { id: 'k4', l1: '色彩心理', l2: '提亮肤色', formula: '[冷色调] + [皮肤对比] = [中和面部暗沉]' },
  { id: 'k5', l1: '几何平衡', l2: '抵消下颌方度', formula: '[圆润弧度] + [中和直线] = [视觉内缩下颌]' }
];

export const ORIGINS = ['显脸大', '头型扁塌', '发际线高', '颧骨外扩', '面中凹陷'];
export const SCENES = ['通勤', '约会', '度假', '骑行', '冬季御寒', '夏季防晒'];
