import express from "express";
import cors from "cors";
import {
  generateAssetImage,
  generateSkeleton,
  generateTopics,
  scoreAsset,
  translateLogicToPrompt,
} from "./geminiService.js";
import type { ParameterState, TopicCard } from "./types";
import { ensureTables, pool } from "./db.js";
import { findUserByEmail, seedUsersFromEnv, signToken, verifyToken } from "./auth.js";

const app = express();

const port = Number(process.env.PORT || 8787);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Startup: ensure DB schema and seed users if provided
ensureTables()
  .then(seedUsersFromEnv)
  .catch((err) => {
    console.error("[startup] failed to init db", err);
    process.exit(1);
  });

app.use(
  cors({
    origin: [clientOrigin, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const bcryptjs = await import("bcryptjs");
  const bcrypt = bcryptjs.default || bcryptjs;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Unauthorized" });
  (req as any).user = payload;
  next();
}

app.post("/api/topics", requireAuth, async (req, res) => {
  try {
    const params = req.body as ParameterState;
    const topics = await generateTopics(params);
    res.json({ topics });
  } catch (err: any) {
    console.error("[api/topics] Error:", err);
    // 即使 generateTopics 失败，也应该返回降级数据
    // 如果这里收到错误，说明降级方案也失败了，返回错误信息
    res.status(500).json({ 
      error: err?.message || "Failed to generate topics",
      // 提供降级数据作为后备
      topics: err?.topics || []
    });
  }
});

app.post("/api/skeleton", requireAuth, async (req, res) => {
  try {
    const { topic, params } = req.body as { topic: TopicCard; params: ParameterState };
    const stream = await generateSkeleton(topic, params);
    // persist generation log for shared multi-user history
    const userId = (req as any).user?.sub as number | undefined;
    if (userId) {
      await pool.query(
        "insert into generation_logs(user_id, params, topic, stream) values (?,?,?,?)",
        [userId, JSON.stringify(params), JSON.stringify(topic), JSON.stringify(stream)],
      );
    }
    res.json({ stream });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Failed to generate skeleton" });
  }
});

app.post("/api/translate-prompt", requireAuth, async (req, res) => {
  try {
    const { visualLogic } = req.body as { visualLogic: string };
    const prompt = await translateLogicToPrompt(visualLogic);
    res.json({ prompt });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Failed to translate prompt" });
  }
});

app.post("/api/image", requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body as { prompt: string };
    const imageUrl = await generateAssetImage(prompt);
    res.json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Failed to generate image" });
  }
});

app.post("/api/score", requireAuth, async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body as { imageUrl: string; prompt: string };
    const score = await scoreAsset(imageUrl, prompt);
    res.json({ score });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || "Failed to score asset" });
  }
});

app.get("/api/logs", requireAuth, async (_req, res) => {
  const rows = await pool.query(
    "select id, params, topic, stream, created_at from generation_logs order by created_at desc limit 20",
  );
  res.json({ logs: rows.rows });
});

app.listen(port, () => {
  console.log(`[server] listening on :${port} (allowing origin ${clientOrigin})`);
});

