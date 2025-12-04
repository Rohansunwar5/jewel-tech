import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { adminBlockUser, adminGetUserById, adminListUsers, adminUpdateStatus, profile, requestOtp, updateProfile, verifyOtp } from '../controllers/auth.controller';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';

const authRouter = Router();

authRouter.post('/request-otp', asyncHandler(requestOtp));
authRouter.post('/verify-otp', asyncHandler(verifyOtp));
authRouter.get('/profile', isLoggedIn, asyncHandler(profile));
authRouter.patch('/profile', isLoggedIn, asyncHandler(updateProfile));

// admin   //TODO: protect with admin auth middleware
authRouter.get('/list-users', asyncHandler(adminListUsers));
authRouter.get('/user/:id', asyncHandler(adminGetUserById));
authRouter.patch('/:id/status', asyncHandler(adminUpdateStatus));
authRouter.patch('/:id/block', asyncHandler(adminBlockUser));

export default authRouter;