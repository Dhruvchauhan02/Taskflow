import { GoogleGenAI } from "@google/genai"

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
const DEFAULT_TIMEOUT_MS = 60000

class AiConfigurationError extends Error {
  constructor(message) {
    super(message)
    this.name = "AiConfigurationError"
  }
}

class AiTimeoutError extends Error {
  constructor(message) {
    super(message)
    this.name = "AiTimeoutError"
  }
}

class AiProviderError extends Error {
  constructor(message, cause) {
    super(message)
    this.name = "AiProviderError"
    this.cause = cause
  }
}

const getTimeoutMs = () =>
  Number.isFinite(Number(process.env.AI_TIMEOUT_MS)) &&
  Number(process.env.AI_TIMEOUT_MS) > 0
    ? Number(process.env.AI_TIMEOUT_MS)
    : DEFAULT_TIMEOUT_MS

const getGeminiModel = () => process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL

const getAiProviderName = () =>
  (process.env.AI_PROVIDER || "gemini").toLowerCase()

const createTimeoutSignal = (timeoutMs) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  }
}

const readResponseText = (response) => {
  if (typeof response.text === "function") {
    return response.text()
  }

  return response.text
}

const cleanConfig = (config) =>
  Object.fromEntries(
    Object.entries(config).filter(([, value]) => value !== undefined)
  )

const createGeminiProvider = () => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new AiConfigurationError("GEMINI_API_KEY is not configured")
  }

  const client = new GoogleGenAI({ apiKey })

  return {
    async generateText(prompt, options = {}) {
      const timeoutMs = options.timeoutMs || getTimeoutMs()
      const { signal, clear } = createTimeoutSignal(timeoutMs)

      try {
        const config = cleanConfig({
          abortSignal: signal,
          httpOptions: {
            timeout: timeoutMs,
          },
          maxOutputTokens: options.maxOutputTokens,
          responseJsonSchema: options.responseJsonSchema,
          responseMimeType: options.responseMimeType,
          thinkingConfig: Number.isFinite(options.thinkingBudget)
            ? { thinkingBudget: options.thinkingBudget }
            : undefined,
          temperature: options.temperature,
        })

        const response = await client.models.generateContent({
          model: options.model || getGeminiModel(),
          contents: prompt,
          config,
        })

        const text = await readResponseText(response)

        if (!text || !text.trim()) {
          throw new AiProviderError("AI provider returned an empty response")
        }

        return text.trim()
      } catch (error) {
        if (signal.aborted || error.name === "AbortError") {
          throw new AiTimeoutError("AI provider request timed out")
        }

        if (error instanceof AiProviderError) {
          throw error
        }

        throw new AiProviderError("AI provider request failed", error)
      } finally {
        clear()
      }
    },
  }
}

const providers = {
  gemini: createGeminiProvider,
}

const createProvider = () => {
  const AI_PROVIDER = getAiProviderName()
  const providerFactory = providers[AI_PROVIDER]

  if (!providerFactory) {
    throw new AiConfigurationError(`Unsupported AI_PROVIDER: ${AI_PROVIDER}`)
  }

  return providerFactory()
}

let provider

const getProvider = () => {
  if (!provider) {
    provider = createProvider()
  }

  return provider
}

export const generateAiText = (prompt, options = {}) =>
  getProvider().generateText(prompt, options)

export const getAiErrorMessage = (error, fallback) => {
  if (error instanceof AiConfigurationError) {
    return error.message
  }

  if (error instanceof AiTimeoutError) {
    return "AI is taking too long to respond. Please try again."
  }

  return fallback
}
