import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';

import { loginValidator, signupValidator } from '../middlewares/validators/auth.validator';
import isAdminLoggedIn from '../middlewares/isAdminLoggedIn.middleware';
import { adminLogin, adminProfile, adminSignup, generateResetPasswordLink, resetPassword, verifyResetPasswordCode } from '../controllers/admin.controller';
import { adminCreateProduct, adminDeleteProduct, adminListProducts, adminUpdateProduct, uploadAssets } from '../controllers/product.controller';
import { adminBlockUser, adminGetUserById, adminListUsers, adminUpdateStatus } from '../controllers/auth.controller';
import { adminCreateCategory, adminDeleteCategory, adminListCategories, adminUpdateCategory } from '../controllers/category.controller';
import { uploadImage } from '../middlewares/multer.middleware';

const adminRouter = Router();

adminRouter.post('/login', loginValidator, asyncHandler(adminLogin));
adminRouter.post('/signup', signupValidator, asyncHandler(adminSignup));
adminRouter.get('/profile', isAdminLoggedIn, asyncHandler(adminProfile));
adminRouter.post('/reset-password', asyncHandler(generateResetPasswordLink));
adminRouter.post('/create-product',isAdminLoggedIn, asyncHandler(adminCreateProduct));
adminRouter.patch('/product/:id',isAdminLoggedIn, asyncHandler(adminUpdateProduct));
adminRouter.get('/reset-password/:code', asyncHandler(verifyResetPasswordCode));
adminRouter.patch('/reset-password/:code', asyncHandler(resetPassword));

//product
adminRouter.get('/list-products',isAdminLoggedIn, asyncHandler(adminListProducts));
adminRouter.delete('/:id',isAdminLoggedIn, asyncHandler(adminDeleteProduct));
adminRouter.post( '/upload/assets', isAdminLoggedIn, uploadImage, asyncHandler(uploadAssets));

//user
adminRouter.get('/list-users',isAdminLoggedIn, asyncHandler(adminListUsers));
adminRouter.get('/user/:id',isAdminLoggedIn, asyncHandler(adminGetUserById));
adminRouter.patch('/:id/status',isAdminLoggedIn, asyncHandler(adminUpdateStatus));
adminRouter.patch('/:id/block',isAdminLoggedIn, asyncHandler(adminBlockUser));

//category
adminRouter.get('/category/list-categories', isAdminLoggedIn, asyncHandler(adminListCategories));
adminRouter.post('/category/create', isAdminLoggedIn, asyncHandler(adminCreateCategory));
adminRouter.patch('/category/update/:id', isAdminLoggedIn, asyncHandler(adminUpdateCategory));
adminRouter.delete('/category/delete/:id', isAdminLoggedIn, asyncHandler(adminDeleteCategory));

export default adminRouter;