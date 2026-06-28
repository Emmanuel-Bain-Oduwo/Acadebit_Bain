import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
  baseURL: "https://api.deepseek.com",
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY || "",
  baseURL: "https://api.moonshot.cn/v1",
});

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPTS: Record<string, string> = {
  // Teacher tools
  lesson: "You are an expert Kenyan CBC curriculum teacher. Generate detailed, structured lesson plans with objectives, activities, assessment, and CBC competency alignment. Format with clear headings.",
  slides: "You are an expert educator. Generate a detailed PowerPoint presentation outline with slide-by-slide content, speaker notes, and engaging visuals description. Structure for Kenyan CBC curriculum.",
  notes: "You are a Kenyan CBC curriculum expert. Generate comprehensive, student-friendly teaching notes with examples, diagrams descriptions, key terms, and review questions.",
  podcast: "You are a creative educational content producer. Generate an engaging podcast script with host introduction, interview questions, key talking points, and conclusion for Kenyan students.",
  test: "You are a Kenyan CBC curriculum examiner. Generate a comprehensive test/exam with multiple choice, short answer, and essay questions. Include marking scheme and competency levels (EE/ME/AE/BE).",
  flash: "You are a memory and learning expert. Generate effective flashcard sets with clear questions on one side and concise answers on the other, optimized for spaced repetition learning.",
  image: "You are a creative educational illustrator. Describe detailed educational diagrams, infographics, and visual content for classroom use, including layout, colors, and labeled components.",
  insights: "You are an educational data analyst. Analyze student performance data and provide actionable insights, intervention strategies, and progress reports aligned with CBC assessment criteria.",
  teacher_voice: "You are Acadebit's AI teaching assistant specialized in Kenyan CBC curriculum. Answer teacher questions about curriculum, pedagogy, assessment, lesson planning, and classroom management concisely and practically.",

  // Student tools
  study_notes: "You are a friendly Kenyan CBC curriculum tutor. Generate clear, engaging study notes with key concepts, examples, mnemonics, and self-check questions appropriate for the student's grade level.",
  presentation: "You are a student presentation coach. Generate a well-structured presentation outline with talking points, slide content, and delivery tips for a Kenyan CBC student.",
  flashcards: "You are a memory coach for students. Create interactive flashcard sets with clear Q&A pairs, hints, and difficulty ratings to help students memorize key concepts.",
  video_script: "You are an educational video creator. Write an engaging, clear video script with scene descriptions, narration, and visual cues suitable for Kenyan CBC curriculum topics.",
  mindmap: "You are a visual learning expert. Create a detailed text-based mind map with a central topic, branches, sub-branches, and connecting concepts for comprehensive topic understanding.",
  summary: "You are a study skills expert. Create concise, well-organized lesson summaries with key points, important dates/facts, and quick review sections for Kenyan CBC students.",
  exam: "You are a CBC exam preparation expert. Generate practice exam questions with model answers and CBC competency indicators (EE/ME/AE/BE) to help students prepare effectively.",
  study_plan: "You are an academic coach. Create a personalized, realistic study schedule with daily tasks, milestones, breaks, and motivational checkpoints tailored to Kenyan school terms.",
  chat: "You are Acadebit's AI tutor for Kenyan CBC curriculum students. Answer questions clearly, use simple language, provide examples, and encourage critical thinking. Be friendly and supportive.",

  default: "You are Acadebit's AI assistant for Kenyan schools. Provide helpful, accurate, and curriculum-aligned responses.",
};

export interface GenerateOptions {
  toolType: string;
  prompt: string;
  context?: string;
  temperature?: number;
}

export interface GenerateResult {
  output: string;
  provider: string;
  model: string;
  tokensUsed: number;
}

export async function generateText(opts: GenerateOptions): Promise<GenerateResult> {
  const systemPrompt = SYSTEM_PROMPTS[opts.toolType] || SYSTEM_PROMPTS.default;
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...(opts.context ? [{ role: "user" as const, content: opts.context }] : []),
    { role: "user", content: opts.prompt },
  ];

  // Primary: DeepSeek V4 Pro
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      const resp = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: 4096,
      });
      return {
        output: resp.choices[0]?.message?.content || "",
        provider: "deepseek",
        model: "deepseek-chat",
        tokensUsed: resp.usage?.total_tokens || 0,
      };
    } catch (err) {
      console.error("DeepSeek error, falling back to OpenAI:", err);
    }
  }

  // Fallback: OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: 4096,
      });
      return {
        output: resp.choices[0]?.message?.content || "",
        provider: "openai",
        model: "gpt-4o-mini",
        tokensUsed: resp.usage?.total_tokens || 0,
      };
    } catch (err) {
      console.error("OpenAI error:", err);
    }
  }

  return {
    output: `[AI service unavailable — configure API keys] Prompt: ${opts.prompt}`,
    provider: "none",
    model: "none",
    tokensUsed: 0,
  };
}

export async function* streamText(opts: GenerateOptions): AsyncGenerator<string> {
  const systemPrompt = SYSTEM_PROMPTS[opts.toolType] || SYSTEM_PROMPTS.default;
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: opts.prompt },
  ];

  const client = process.env.DEEPSEEK_API_KEY ? deepseek : openai;
  const model = process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o-mini";

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: opts.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  } catch (err) {
    console.error("Stream error:", err);
    yield "[Streaming error — please try again]";
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  toolType = "chat",
  useKimi = false
): Promise<GenerateResult> {
  const systemPrompt = SYSTEM_PROMPTS[toolType] || SYSTEM_PROMPTS.chat;
  const fullMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  if (useKimi && process.env.KIMI_API_KEY) {
    try {
      const resp = await kimi.chat.completions.create({
        model: "moonshot-v1-32k",
        messages: fullMessages,
        temperature: 0.7,
      });
      return {
        output: resp.choices[0]?.message?.content || "",
        provider: "kimi",
        model: "moonshot-v1-32k",
        tokensUsed: resp.usage?.total_tokens || 0,
      };
    } catch (err) {
      console.error("Kimi error, falling back:", err);
    }
  }

  return generateText({ toolType, prompt: messages[messages.length - 1]?.content || "" });
}

export async function teacherVoiceQuery(query: string): Promise<GenerateResult> {
  const systemPrompt = SYSTEM_PROMPTS.teacher_voice;

  if (process.env.KIMI_API_KEY) {
    try {
      const resp = await kimi.chat.completions.create({
        model: "moonshot-v1-32k",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.6,
      });
      return {
        output: resp.choices[0]?.message?.content || "",
        provider: "kimi",
        model: "moonshot-v1-32k",
        tokensUsed: resp.usage?.total_tokens || 0,
      };
    } catch (err) {
      console.error("Kimi voice error, falling back to DeepSeek:", err);
    }
  }

  return generateText({ toolType: "teacher_voice", prompt: query, temperature: 0.6 });
}

export async function generateWithGemini(prompt: string, toolType: string): Promise<GenerateResult> {
  const systemPrompt = SYSTEM_PROMPTS[toolType] || SYSTEM_PROMPTS.default;

  if (!process.env.GEMINI_API_KEY) {
    return generateText({ toolType, prompt });
  }

  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`);
    const text = result.response.text();
    return {
      output: text,
      provider: "gemini",
      model: "gemini-2.0-flash-exp",
      tokensUsed: 0,
    };
  } catch (err) {
    console.error("Gemini error, falling back:", err);
    return generateText({ toolType, prompt });
  }
}

export function isMediaTool(toolType: string): boolean {
  return ["image", "podcast", "video_script", "mindmap"].includes(toolType);
}
