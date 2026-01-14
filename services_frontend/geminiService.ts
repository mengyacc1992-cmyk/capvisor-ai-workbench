import { ParameterState, TopicCard, AssetCardData } from "../types";
import { apiFetch } from "./apiClient";

export async function generateTopics(params: ParameterState): Promise<TopicCard[]> {
  const res = await apiFetch<{ topics: TopicCard[] }>("/api/topics", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return res.topics;
}

export async function generateSkeleton(topic: TopicCard, params: ParameterState): Promise<AssetCardData[]> {
  const res = await apiFetch<{ stream: AssetCardData[] }>("/api/skeleton", {
    method: "POST",
    body: JSON.stringify({ topic, params }),
  });
  return res.stream;
}

export async function translateLogicToPrompt(visualLogic: string): Promise<string> {
  const res = await apiFetch<{ prompt: string }>("/api/translate-prompt", {
    method: "POST",
    body: JSON.stringify({ visualLogic }),
  });
  return res.prompt;
}

export async function generateAssetImage(userPrompt: string): Promise<string> {
  const res = await apiFetch<{ imageUrl: string }>("/api/image", {
    method: "POST",
    body: JSON.stringify({ prompt: userPrompt }),
  });
  return res.imageUrl;
}

export async function scoreAsset(imageUrl: string, prompt: string): Promise<number> {
  const res = await apiFetch<{ score: number }>("/api/score", {
    method: "POST",
    body: JSON.stringify({ imageUrl, prompt }),
  });
  return res.score;
}

