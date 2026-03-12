import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import commRoutes from './routes/comm.routes';
import storeRoutes from './routes/store.routes';
import userRoutes from './routes/user.routes';
import userStoreRoutes from './routes/user-store.routes';
import importRoutes from './routes/import.routes';
import exportRoutes from './routes/export.routes';

// App configuration and middleware registration
dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Register API routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comms', commRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-stores', userStoreRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/exports', exportRoutes);

// Simple health check for load balancers / container orchestrators
app.get('/health', (req, res) => res.json({ ok: true }));

export default app;
