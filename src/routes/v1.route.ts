import { Router } from 'express';
import { country, health, helloWorld } from '../controllers/health.controller';
import { asyncHandler } from '../utils/asynchandler';
import authRouter from './auth.route';
import contactRouter from './contact.route';
import adminRouter from './admin.route';
import productRouter from './product.route';
import cartRouter from './cart.route';

const v1Router = Router();

v1Router.get('/', asyncHandler(helloWorld));
v1Router.get('/health', asyncHandler(health));
v1Router.use('/auth', authRouter);
v1Router.use('/contact', contactRouter);
v1Router.use('/admin', adminRouter);
v1Router.use('/product', productRouter);
v1Router.use('/cart', cartRouter);
v1Router.get('/country', asyncHandler(country));

export default v1Router;
