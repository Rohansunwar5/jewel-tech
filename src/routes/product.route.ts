import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { getProductById, listActiveProducts } from '../controllers/product.controller';
import isApprovedDealer from '../middlewares/isApprovedDealer';

const productRouter = Router();

productRouter.get('/', isLoggedIn, isApprovedDealer, asyncHandler(listActiveProducts));
productRouter.get('/:id', isLoggedIn, isApprovedDealer,asyncHandler(getProductById));

//admin
// productRouter.get('/admin/list-products', asyncHandler(adminListProducts));
// productRouter.post('/admin/create-product', asyncHandler(adminCreateProduct));
// productRouter.patch('/admin/:id', asyncHandler(adminUpdateProduct));
// productRouter.delete('/:id', asyncHandler(adminDeleteProduct));

export default productRouter;