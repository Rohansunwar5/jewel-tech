import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { addToCart, clearCart, generateEnquiry, getCart, removeFromCart } from '../controllers/cart.controller';

const cartRouter = Router();

cartRouter.get('/', isLoggedIn, asyncHandler(getCart));
cartRouter.post('/add', isLoggedIn, asyncHandler(addToCart));
cartRouter.post('/remove', isLoggedIn, asyncHandler(removeFromCart));
cartRouter.post('/clear', isLoggedIn, asyncHandler(clearCart));
cartRouter.post('/generate-enquiry', isLoggedIn, asyncHandler(generateEnquiry));

export default cartRouter;