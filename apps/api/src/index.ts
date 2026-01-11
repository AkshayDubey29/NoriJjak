import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth';
import sportsRoutes from './routes/sports';
import userRoutes from './routes/user';
import gameRoutes from './routes/games';
import notificationRoutes from './routes/notifications';
import venueRoutes from './routes/venues';
import clubRoutes from './routes/clubs';
import safetyRoutes from './routes/safety';
// import chatRoutes from './routes/chat';
// import ratingRoutes from './routes/ratings';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.WEB_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/version', (req, res) => {
  res.json({
    name: 'NORIJJAK',
    version: '0.1.0',
    env: process.env.NODE_ENV || 'development'
  });
});

app.use('/auth', authRoutes);
app.use('/sports', sportsRoutes);
app.use('/user', userRoutes);
app.use('/games', gameRoutes);
app.use('/notifications', notificationRoutes);
app.use('/venues', venueRoutes);
app.use('/clubs', clubRoutes);
app.use('/safety', safetyRoutes);
// app.use('/games/:id/chat', chatRoutes);
// app.use('/ratings', ratingRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}

export default app;
