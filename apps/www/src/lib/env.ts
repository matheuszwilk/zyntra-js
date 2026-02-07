/**
 * Environment variables validation and configuration
 * Features are gracefully disabled if their dependencies are missing
 */

// Check if a feature is enabled based on required env vars
export const features = {
  // AI Chat requires Google API key
  aiChat: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,

  // Analytics requires GA ID
  analytics: !!process.env.NEXT_PUBLIC_GA_ID,

  // Database requires DATABASE_URL
  database: !!process.env.DATABASE_URL,

  // Telegram bot requires token and webhook
  telegram: !!(process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_WEBHOOK_URL),

  // WhatsApp bot requires token and phone
  whatsapp: !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID),
} as const;

// Get env var with fallback
export function getEnv(key: string, fallback = ''): string {
  return process.env[key] || fallback;
}

// Log warnings for missing optional features
if (typeof window === 'undefined') {
  // Server-side only
  console.log('🔧 Feature availability:');
  console.log(`  - AI Chat: ${features.aiChat ? '✅' : '❌ (GOOGLE_GENERATIVE_AI_API_KEY missing)'}`);
  console.log(`  - Analytics: ${features.analytics ? '✅' : '⚠️  (NEXT_PUBLIC_GA_ID missing)'}`);
  console.log(`  - Database: ${features.database ? '✅' : '⚠️  (DATABASE_URL missing)'}`);
  console.log(`  - Telegram: ${features.telegram ? '✅' : '⚠️  (optional)'}`);
  console.log(`  - WhatsApp: ${features.whatsapp ? '✅' : '⚠️  (optional)'}`);
}

export default features;
