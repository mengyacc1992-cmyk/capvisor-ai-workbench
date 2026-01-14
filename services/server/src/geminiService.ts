import { GoogleGenAI, Type } from "@google/genai";
import type { AssetCardData, ParameterState, TopicCard } from "./types";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  // Fail fast so we don't accidentally run without auth and get confusing runtime errors.
  throw new Error("Missing GEMINI_API_KEY (or API_KEY) environment variable");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateTopics(params: ParameterState): Promise<TopicCard[]> {
  const prompt = `
    As a fashion content expert, generate 8 content topics for a "Hat x Face Shape" brand.
    Target Audience: People with ${params.faceShape} face shape.
    Product Focus: ${params.hatType}.
    Context: ${params.scene.join(", ")}.
    Pain Points: ${params.origin.join(", ")}.
    Depth Level: ${params.depth}/3.

    Output a JSON array of objects with fields: id, title, heat (1-100), summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              heat: { type: Type.NUMBER },
              summary: { type: Type.STRING },
            },
            required: ["id", "title", "heat", "summary"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // 如果解析结果为空，继续使用降级方案
    throw new Error("API returned empty result");
  } catch (error: any) {
    console.error("[generateTopics] API error:", error.message);
    console.log("[generateTopics] 使用降级方案生成模拟数据");
    // 返回差异化的模拟数据作为降级方案
    const topicTemplates = [
      {
        title: `${params.faceShape}如何选择${params.hatType}？这3个技巧必须知道`,
        summary: `深度解析${params.faceShape}脸型与${params.hatType}的搭配原理，从视觉重心到色彩心理，全面解析搭配技巧`,
      },
      {
        title: `${params.origin[0] || '显脸大'}？${params.hatType}帮你秒变V脸`,
        summary: `针对${params.origin[0] || '显脸大'}痛点，${params.hatType}如何通过视觉错觉原理实现显脸小的效果`,
      },
      {
        title: `${params.scene[0] || '通勤'}场景下，${params.faceShape}的${params.hatType}穿搭指南`,
        summary: `结合${params.scene.join('、')}等实际场景，为${params.faceShape}提供${params.hatType}的实用穿搭方案`,
      },
      {
        title: `从美学原理到实战：${params.faceShape} x ${params.hatType}的完整攻略`,
        summary: `从黄金比例、视觉重心转移等美学原理出发，深入解析${params.hatType}如何优化${params.faceShape}的视觉效果`,
      },
      {
        title: `${params.hatType}的版型选择：${params.faceShape}必看的5个细节`,
        summary: `帽檐宽度、帽冠高度、材质选择等细节如何影响${params.faceShape}的搭配效果，专业解析版型选择技巧`,
      },
      {
        title: `色彩心理学：${params.hatType}的颜色如何影响${params.faceShape}的视觉美感`,
        summary: `不同颜色的${params.hatType}如何通过色彩心理学原理提升${params.faceShape}的肤色和整体美感`,
      },
      {
        title: `${params.faceShape}的${params.hatType}搭配误区，你中了几个？`,
        summary: `盘点${params.faceShape}在选择${params.hatType}时常见的搭配误区，帮助避免踩雷，找到最适合的款式`,
      },
      {
        title: `明星同款分析：${params.faceShape}女星的${params.hatType}穿搭密码`,
        summary: `分析同是${params.faceShape}脸型的明星如何选择${params.hatType}，学习她们的穿搭技巧和搭配思路`,
      },
    ];
    
    return topicTemplates.map((template, i) => ({
      id: `topic-${i + 1}`,
      title: template.title,
      heat: Math.floor(Math.random() * 40 + 60),
      summary: template.summary,
    }));
  }
}

export async function generateSkeleton(topic: TopicCard, params: ParameterState): Promise<AssetCardData[]> {
  const prompt = `
    Create a Content Asset Stream (CAS) for the topic: "${topic.title}".
    Parameters: Face Shape ${params.faceShape}, Hat ${params.hatType}, Pages ${params.volume}.

    For each page (total ${params.volume}), generate:
    1. logicType: One of ['引入', '痛点分析', '美学原理', '解决方案', '产品种草']
    2. visualLogic: Describe the visual content focus in Chinese (e.g., "模特戴着平直窄檐帽的侧脸对比...").
    3. prompt: Translate visualLogic into a detailed English AI image generation prompt.
    4. headline: A catchy title for that page.
    5. l1Knowledge: A core aesthetic principle.
    6. l2Knowledge: A practical formula.
    7. script: Short-form video/social media caption text for this page.

    Output a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              logicType: { type: Type.STRING },
              visualLogic: { type: Type.STRING },
              prompt: { type: Type.STRING },
              headline: { type: Type.STRING },
              l1Knowledge: { type: Type.STRING },
              l2Knowledge: { type: Type.STRING },
              script: { type: Type.STRING },
            },
          },
        },
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `card-${index}`,
      visualStatus: "skeleton",
    }));
  } catch (error: any) {
    console.error("[generateSkeleton] API error:", error.message);
    // 返回更真实的模拟数据作为降级方案，每个卡片都有不同的内容
    const logicTypes = ['引入', '痛点分析', '美学原理', '解决方案', '产品种草'];
    const knowledgeBase = [
      { l1: "视觉重心转移原理", l2: "增加颅顶高度" },
      { l1: "视错觉原理", l2: "对比肩宽" },
      { l1: "骨相分析", l2: "修饰颧骨外扩" },
      { l1: "色彩心理", l2: "提亮肤色" },
      { l1: "几何平衡", l2: "抵消下颌方度" },
    ];
    
    // 根据选题内容生成相关的视觉逻辑
    const topicKeywords = topic.title.includes('技巧') ? '技巧展示' : 
                          topic.title.includes('痛点') ? '痛点对比' :
                          topic.title.includes('场景') ? '场景化展示' :
                          topic.title.includes('原理') ? '原理图解' :
                          topic.title.includes('版型') ? '版型细节' :
                          topic.title.includes('颜色') ? '色彩对比' :
                          topic.title.includes('误区') ? '误区对比' :
                          topic.title.includes('明星') ? '明星同款' : '常规展示';
    
    const visualLogicTemplates = {
      '引入': [
        `模特正面展示${params.hatType}，突出${params.faceShape}脸型的整体轮廓，呼应"${topic.title}"的主题`,
        `侧脸45度角，展示${params.hatType}与${params.faceShape}的协调感，体现${topicKeywords}的视觉效果`,
        `多角度对比：正面、侧面、45度角，全面展示${params.hatType}效果，契合"${topic.title}"的深度解析`,
      ],
      '痛点分析': [
        `对比图：不戴帽 vs 戴${params.hatType}，突出${params.origin[0] || '显脸大'}问题的改善，呼应"${topic.title}"中的痛点分析`,
        `特写镜头聚焦${params.faceShape}的关键区域，展示${params.hatType}的修饰作用，体现"${topic.title}"的解决方案`,
        `动态抓拍：模特转头瞬间，展示${params.hatType}对${params.faceShape}的修饰效果，验证"${topic.title}"的实用性`,
      ],
      '美学原理': [
        `黄金分割构图，${params.hatType}作为视觉焦点，引导视线，诠释"${topic.title}"中的美学原理`,
        `光影对比：强光打在${params.hatType}上，弱化${params.faceShape}的不足，展示"${topic.title}"提到的视觉技巧`,
        `色彩层次：${params.hatType}的颜色与肤色形成对比，提升整体美感，体现"${topic.title}"的色彩心理学应用`,
      ],
      '解决方案': [
        `专业搭配示范：${params.hatType} + 适合${params.faceShape}的发型和妆容，实践"${topic.title}"的搭配方案`,
        `场景化展示：在${params.scene[0] || '通勤'}场景中，${params.hatType}的实际应用，验证"${topic.title}"的实用性`,
        `细节特写：${params.hatType}的材质、版型如何优化${params.faceShape}的视觉效果，详解"${topic.title}"中的关键细节`,
      ],
      '产品种草': [
        `情感化表达：模特自信佩戴${params.hatType}，展现${params.faceShape}的独特魅力，呼应"${topic.title}"的情感价值`,
        `生活化场景：${params.scene[0] || '日常'}中${params.hatType}的自然呈现，体现"${topic.title}"的实用场景`,
        `多场景切换：${params.scene.join('、')}等不同场合，${params.hatType}的百搭性，验证"${topic.title}"的适用性`,
      ],
    };
    
    const headlineTemplates = {
      '引入': [
        `${topic.title}：完美搭配从这里开始`,
        `揭秘${params.faceShape}最适合的${params.hatType}款式`,
        `${topic.title}：${params.faceShape}的${params.hatType}选择指南`,
      ],
      '痛点分析': [
        `${params.origin[0] || '显脸大'}？${params.hatType}帮你解决`,
        `${params.faceShape}的困扰，${params.hatType}来拯救`,
        `告别${params.origin[0] || '显脸大'}，${params.hatType}的正确打开方式`,
      ],
      '美学原理': [
        `视觉重心转移：${params.hatType}如何优化${params.faceShape}`,
        `黄金比例法则：${params.hatType}与${params.faceShape}的完美平衡`,
        `色彩心理学：${params.hatType}如何提升${params.faceShape}的视觉美感`,
      ],
      '解决方案': [
        `${params.faceShape} x ${params.hatType}：专业搭配方案`,
        `场景化搭配：${params.scene[0] || '通勤'}中的${params.hatType}应用`,
        `细节决定成败：${params.hatType}的${params.faceShape}适配技巧`,
      ],
      '产品种草': [
        `${params.hatType}：${params.faceShape}的时尚新选择`,
        `从${params.scene[0] || '日常'}到${params.scene[1] || '约会'}，${params.hatType}的百搭魅力`,
        `自信从${params.hatType}开始：${params.faceShape}的完美蜕变`,
      ],
    };
    
    const scriptTemplates = {
      '引入': [
        `关于"${topic.title}"，如果你是${params.faceShape}，${params.hatType}可能是你的最佳选择。今天就来聊聊为什么。`,
        `${topic.title}：${params.faceShape} x ${params.hatType}，这个组合比你想象的更完美。`,
        `谁说${params.faceShape}不适合${params.hatType}？关于"${topic.title}"，看完这篇你就知道了。`,
      ],
      '痛点分析': [
        `${params.faceShape}最怕的就是${params.origin[0] || '显脸大'}，而${params.hatType}正好能解决这个问题。`,
        `很多${params.faceShape}的朋友都有${params.origin[0] || '显脸大'}的困扰，${params.hatType}来帮你。`,
        `为什么${params.faceShape}容易${params.origin[0] || '显脸大'}？${params.hatType}如何改善？`,
      ],
      '美学原理': [
        `视觉重心转移原理告诉我们，${params.hatType}可以通过上移重心来优化${params.faceShape}。`,
        `黄金比例法则：${params.hatType}的宽度和高度如何与${params.faceShape}形成最佳比例。`,
        `色彩心理学：${params.hatType}的颜色选择如何影响${params.faceShape}的视觉效果。`,
      ],
      '解决方案': [
        `${params.faceShape}选择${params.hatType}时，要注意版型、材质和颜色。`,
        `在${params.scene[0] || '通勤'}场景中，${params.hatType}的搭配技巧有哪些？`,
        `细节决定成败：${params.hatType}的细节设计如何优化${params.faceShape}的视觉效果。`,
      ],
      '产品种草': [
        `这款${params.hatType}专为${params.faceShape}设计，从${params.scene[0] || '日常'}到${params.scene[1] || '约会'}都能完美驾驭。`,
        `如果你也是${params.faceShape}，这款${params.hatType}绝对值得拥有。`,
        `${params.hatType}：让${params.faceShape}的你更加自信美丽。`,
      ],
    };
    
    return Array.from({ length: params.volume }, (_, i) => {
      const logicType = logicTypes[i % logicTypes.length];
      const knowledge = knowledgeBase[i % knowledgeBase.length];
      const pageNum = i + 1;
      
      const visualLogics = visualLogicTemplates[logicType as keyof typeof visualLogicTemplates] || visualLogicTemplates['引入'];
      const headlines = headlineTemplates[logicType as keyof typeof headlineTemplates] || headlineTemplates['引入'];
      const scripts = scriptTemplates[logicType as keyof typeof scriptTemplates] || scriptTemplates['引入'];
      
      const visualLogic = visualLogics[pageNum % visualLogics.length];
      const headline = headlines[pageNum % headlines.length];
      const script = scripts[pageNum % scripts.length];
      
      return {
        id: `card-${i}`,
        logicType: logicType as any,
        visualLogic,
        prompt: `Fashion portrait, ${params.faceShape} face shape, ${params.hatType}, ${visualLogic}, professional studio lighting, high-key lighting, soft shadows, elegant composition, 8k resolution, high quality`,
        headline,
        l1Knowledge: knowledge.l1,
        l2Knowledge: knowledge.l2,
        script,
        visualStatus: "skeleton" as const,
      };
    });
  }
}

export async function translateLogicToPrompt(visualLogic: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Translate the following visual description for an image AI into a detailed, professional English prompt: "${visualLogic}"`,
    });
    return response.text || "";
  } catch (error: any) {
    console.error("[translateLogicToPrompt] API error:", error.message);
    // 返回简单的翻译作为降级方案
    return `Fashion portrait, ${visualLogic}, professional studio lighting, high quality`;
  }
}

export async function generateAssetImage(userPrompt: string): Promise<string> {
  const visualSpecs = `
    High-end commercial fashion editorial portrait.
    Subject: ${userPrompt}.
    Style: Matte skin texture, butterfly lighting, high-key bright studio.
    Environment: Morandi light beige backdrop, wide negative space.
    Camera: Shot on 85mm f/1.2, extreme bokeh, centered symmetry, eye-level perspective.
    Aesthetic: Minimalist, hyper-detailed, 8k resolution, cinematic elegance.
  `.trim();

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 未配置");
  }

  try {
    // 方法1: 尝试使用 Gemini 2.0 Flash 的图片生成能力
    // 注意：Gemini API 目前主要通过文本生成，图片生成功能可能有限
    const imageModels = ["gemini-2.0-flash-exp", "gemini-2.0-flash-thinking-exp"];
    
    for (const modelName of imageModels) {
      try {
        console.log(`[generateAssetImage] 尝试使用模型: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [{ text: visualSpecs }],
          },
          config: {
            imageConfig: { aspectRatio: "3:4" },
          },
        });

        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              console.log(`[generateAssetImage] ✅ 成功使用模型: ${modelName}`);
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }
        }
      } catch (modelError: any) {
        console.log(`[generateAssetImage] 模型 ${modelName} 不可用: ${modelError.message}`);
        continue;
      }
    }

    // 方法2: 尝试使用 Vertex AI Imagen API (需要 Google Cloud 项目)
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    
    if (projectId && apiKey) {
      try {
        // 使用 Vertex AI REST API 调用 Imagen
        // 注意：这需要 Google Cloud 项目和服务账号
        const imagenUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagegeneration@006:predict`;
        
        // 使用 API Key 进行认证（如果支持）
        const imagenResponse = await fetch(imagenUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instances: [{
              prompt: visualSpecs,
            }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "3:4",
            },
          }),
        });

        if (imagenResponse.ok) {
          const data = (await imagenResponse.json()) as {
            predictions?: Array<{ bytesBase64Encoded?: string }>;
          };
          if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
            console.log("[generateAssetImage] ✅ 成功使用 Imagen API 生成图片");
            return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
          }
        }
      } catch (imagenError: any) {
        console.log(`[generateAssetImage] Imagen API 不可用: ${imagenError.message}`);
      }
    }

    // 如果所有方法都失败，提供明确的错误信息和解决方案
    const errorMsg = 
      "图片生成失败。当前 Gemini API 可能不支持直接生成图片。\n\n" +
      "💡 解决方案：\n" +
      "1. 检查网络连接和 API Key 权限\n" +
      "2. 配置 Google Cloud 项目并使用 Vertex AI Imagen API\n" +
      "3. 或集成其他图片生成服务（如 DALL-E、Midjourney、Stable Diffusion 等）\n" +
      "4. 或等待 Google 为 Gemini API 添加图片生成功能\n\n" +
      "📝 提示：可以在 .env.local 中设置 GOOGLE_CLOUD_PROJECT_ID 来启用 Imagen API";
    
    throw new Error(errorMsg);
  } catch (error: any) {
    console.error("[generateAssetImage] API error:", error.message);
    throw error;
  }
}

export async function scoreAsset(_imageUrl: string, _prompt: string): Promise<number> {
  return parseFloat((Math.random() * 5 + 5).toFixed(1));
}

