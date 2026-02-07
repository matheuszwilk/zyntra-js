import express from 'express';

import { expressAdapter } from '@zyntra-js/core/adapters';
import { AppRouter } from './zyntra.router'

const app = express();

// Define the API base path from environment variable or default to '/api/v1'
const ZYNTRA_API_BASE_PATH = process.env.ZYNTRA_API_BASE_PATH || '/api/v1';
const PORT = process.env.PORT || 3000;

// Serve Zyntra.js Router
app.use(ZYNTRA_API_BASE_PATH, expressAdapter(AppRouter.handler));

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
