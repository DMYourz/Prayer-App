import { invokeLLM } from "./_core/llm";

/**
 * AI-powered content moderation for prayer submissions
 * Analyzes content for safety, appropriateness, and potential concerns
 */
export async function moderatePrayerContent(title: string, content: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a content moderation assistant for a Christian prayer community app. 
Analyze prayer requests for safety and appropriateness. Flag content that contains:
- Spam or commercial solicitation
- Hate speech or discrimination
- Explicit self-harm or suicide ideation (requires immediate intervention)
- Inappropriate or offensive language
- Scams or phishing attempts

Be compassionate and understanding. Genuine prayers about struggles, pain, or difficult topics should be approved.
Only flag content that poses genuine safety concerns or violates community standards.`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "moderation_result",
          strict: true,
          schema: {
            type: "object",
            properties: {
              is_safe: {
                type: "boolean",
                description: "Whether the content is safe to publish",
              },
              concerns: {
                type: "array",
                items: { type: "string" },
                description: "List of specific concerns found (empty if safe)",
              },
              requires_review: {
                type: "boolean",
                description: "Whether admin review is needed before publishing",
              },
              severity: {
                type: "string",
                enum: ["none", "low", "medium", "high"],
                description: "Severity level of concerns",
              },
            },
            required: ["is_safe", "concerns", "requires_review", "severity"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = response.choices[0].message.content;
    const result = JSON.parse(typeof responseContent === 'string' ? responseContent : "{}");

    return {
      isSafe: result.is_safe as boolean,
      concerns: result.concerns as string[],
      requiresReview: result.requires_review as boolean,
      severity: result.severity as "none" | "low" | "medium" | "high",
    };
  } catch (error) {
    console.error("[AI Moderation] Error:", error);
    // Fail open: if AI fails, allow content but flag for review
    return {
      isSafe: true,
      concerns: ["AI moderation unavailable - requires manual review"],
      requiresReview: true,
      severity: "low" as const,
    };
  }
}

/**
 * AI-powered prayer categorization
 * Analyzes prayer content and suggests relevant categories and urgency
 */
export async function categorizePrayer(title: string, content: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a prayer categorization assistant. Analyze prayer requests and suggest 1-3 relevant categories.

Available categories:
- Health & Healing (physical illness, medical procedures, recovery)
- Family & Relationships (marriage, children, family conflicts)
- Financial & Work (job loss, debt, career decisions)
- Spiritual Growth (faith struggles, seeking guidance, spiritual warfare)
- Grief & Loss (death, bereavement, mourning)
- Mental Health (anxiety, depression, emotional struggles)
- Protection & Safety (travel, dangerous situations, legal issues)
- Guidance & Decisions (major life choices, direction)
- Thanksgiving & Praise (answered prayers, gratitude)
- Community & Church (church needs, ministry, outreach)
- Other (anything not fitting above categories)

Also assess urgency:
- high: Immediate crisis, emergency, time-sensitive
- medium: Important but not urgent
- low: General prayer request, ongoing situation`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "prayer_categories",
          strict: true,
          schema: {
            type: "object",
            properties: {
              categories: {
                type: "array",
                items: { type: "string" },
                description: "1-3 relevant category names",
              },
              urgency: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "Urgency level of the prayer request",
              },
            },
            required: ["categories", "urgency"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = response.choices[0].message.content;
    const result = JSON.parse(typeof responseContent === 'string' ? responseContent : "{}");

    return {
      categories: result.categories as string[],
      urgency: result.urgency as "low" | "medium" | "high",
    };
  } catch (error) {
    console.error("[AI Categorization] Error:", error);
    // Fail gracefully: return default values
    return {
      categories: ["Other"],
      urgency: "medium" as const,
    };
  }
}

/**
 * AI-powered semantic search for prayers
 * Finds prayers similar to the search query using natural language understanding
 */
export async function semanticSearchPrayers(
  query: string,
  allPrayers: Array<{ id: number; title: string; content: string }>
) {
  try {
    // For semantic search, we'll use AI to analyze the query and match against prayer content
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a prayer search assistant. Given a search query and a list of prayers, identify which prayers are most relevant to the query.
Consider semantic similarity, not just keyword matching. For example:
- "anxiety" should match prayers about worry, fear, stress, nervousness
- "job loss" should match prayers about unemployment, career, financial struggles
- "healing" should match prayers about sickness, recovery, medical issues

Return the IDs of the most relevant prayers, ranked by relevance.`,
        },
        {
          role: "user",
          content: `Search query: "${query}"\n\nPrayers:\n${allPrayers
            .slice(0, 50) // Limit to first 50 to avoid token limits
            .map((p) => `ID ${p.id}: ${p.title} - ${p.content.substring(0, 200)}`)
            .join("\n\n")}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "search_results",
          strict: true,
          schema: {
            type: "object",
            properties: {
              relevant_prayer_ids: {
                type: "array",
                items: { type: "number" },
                description: "Prayer IDs ranked by relevance (most relevant first)",
              },
            },
            required: ["relevant_prayer_ids"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = response.choices[0].message.content;
    const result = JSON.parse(typeof responseContent === 'string' ? responseContent : "{}");
    return result.relevant_prayer_ids as number[];
  } catch (error) {
    console.error("[AI Search] Error:", error);
    // Fallback to simple keyword search
    const lowerQuery = query.toLowerCase();
    return allPrayers
      .filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.content.toLowerCase().includes(lowerQuery)
      )
      .map((p) => p.id);
  }
}

/**
 * Generate church insights from prayer data
 * Analyzes prayer patterns to help church leaders understand community needs
 */
export async function generateChurchInsights(
  prayers: Array<{ title: string; content: string; categories?: string | null; createdAt: Date }>
) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a compassionate church ministry assistant. Analyze prayer requests to help church leaders understand their community's needs.

Provide:
1. Top 3-5 themes/categories with percentages
2. Notable trends or patterns
3. Compassionate summary of community needs
4. Suggested ministry focus areas

Be respectful, compassionate, and privacy-preserving. Focus on aggregate patterns, not individual prayers.`,
        },
        {
          role: "user",
          content: `Analyze these ${prayers.length} prayer requests from the past month:\n\n${prayers
            .map((p, i) => `${i + 1}. ${p.title} (${p.categories || "Uncategorized"})`)
            .join("\n")}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "church_insights",
          strict: true,
          schema: {
            type: "object",
            properties: {
              top_themes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    theme: { type: "string" },
                    percentage: { type: "number" },
                  },
                  required: ["theme", "percentage"],
                  additionalProperties: false,
                },
                description: "Top themes with percentages",
              },
              trends: {
                type: "array",
                items: { type: "string" },
                description: "Notable trends or patterns observed",
              },
              summary: {
                type: "string",
                description: "Compassionate summary of community needs",
              },
              ministry_suggestions: {
                type: "array",
                items: { type: "string" },
                description: "Suggested ministry focus areas",
              },
            },
            required: ["top_themes", "trends", "summary", "ministry_suggestions"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = response.choices[0].message.content;
    const result = JSON.parse(typeof responseContent === 'string' ? responseContent : "{}");
    return {
      topThemes: result.top_themes as Array<{ theme: string; percentage: number }>,
      trends: result.trends as string[],
      summary: result.summary as string,
      ministrySuggestions: result.ministry_suggestions as string[],
    };
  } catch (error) {
    console.error("[AI Insights] Error:", error);
    return null;
  }
}

