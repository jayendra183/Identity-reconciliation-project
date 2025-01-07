import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/mongodb.js';
import { identifyRouter } from './routes/identify.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/identify', identifyRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;