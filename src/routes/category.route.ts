import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import isApprovedDealer from '../middlewares/isApprovedDealer';
import { getCategoryById, listActiveCategories } from '../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.get('/', isLoggedIn, isApprovedDealer, asyncHandler(listActiveCategories));
categoryRouter.get('/:id', isLoggedIn, isApprovedDealer, asyncHandler(getCategoryById));

export default categoryRouter;