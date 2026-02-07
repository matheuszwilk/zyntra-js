import { tryCatch } from '@zyntra-js/core'

export async function register() {
  // Only start bot if AI is configured
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('⚠️  AI Chat disabled: GOOGLE_GENERATIVE_AI_API_KEY not configured');
    return;
  }

  try {
    const { bot } = await import('./ai/bots/lia');
    const result = await tryCatch(bot.start());
    console.log(result);
    if (result.error) {
      console.error(result.error);
    }
  } catch (error) {
    console.error('Failed to start bot:', error);
  }
}
