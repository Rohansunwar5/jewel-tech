import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { addToCart, clearCart, generateEnquiry, getCart, removeFromCart } from '../controllers/cart.controller';
import isApprovedDealer from '../middlewares/isApprovedDealer';

const cartRouter = Router();

cartRouter.get('/', isLoggedIn, isApprovedDealer, asyncHandler(getCart));
cartRouter.post('/add', isLoggedIn, isApprovedDealer, asyncHandler(addToCart));
cartRouter.post('/remove', isLoggedIn, isApprovedDealer, asyncHandler(removeFromCart));
cartRouter.post('/clear', isLoggedIn, isApprovedDealer, asyncHandler(clearCart));
cartRouter.post('/generate-enquiry', isLoggedIn, isApprovedDealer, asyncHandler(generateEnquiry));

export default cartRouter;