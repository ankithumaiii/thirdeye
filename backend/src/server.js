import app from './app.js';
import { ENV } from './config/env.js';
import { isGeminiConfigured } from './services/gemini.service.js';

const server = app.listen(ENV.PORT, () => {
  console.log('====================================================');
  console.log(`👁️  ThirdEye Bystander Crisis Engine Backend Online`);
  console.log(`   Port:           http://localhost:${ENV.PORT}`);
  console.log(`   Mode:           ${isGeminiConfigured() ? 'Gemini AI Active (' + ENV.GEMINI_MODEL + ')' : 'Local Tactical Heuristic Fallback'}`);
  console.log(`   CORS Origin:    ${ENV.FRONTEND_ORIGIN}`);
  console.log('====================================================');
});

process.on('SIGTERM', () => {
  console.log('Shutting down server gracefully...');
  server.close(() => process.exit(0));
});
