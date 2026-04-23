import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { adminBlockUser, adminGetUserById, adminListUsers, adminUpdateStatus, loginWithoutOtp, profile, updateProfile } from '../controllers/auth.controller';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';

const authRouter = Router();

// OTP-BYPASSED LOGIN — temporary while SMS service is not active.
// Swap the line below back to the two commented routes when SMS is ready.
authRouter.post('/login', asyncHandler(loginWithoutOtp));
// authRouter.post('/request-otp', asyncHandler(requestOtp));
// authRouter.post('/verify-otp', asyncHandler(verifyOtp));
authRouter.get('/profile', isLoggedIn, asyncHandler(profile));
authRouter.patch('/profile', isLoggedIn, asyncHandler(updateProfile));

// admin   //TODO: protect with admin auth middleware
authRouter.get('/list-users', asyncHandler(adminListUsers));
authRouter.get('/user/:id', asyncHandler(adminGetUserById));
authRouter.patch('/:id/status', asyncHandler(adminUpdateStatus));
authRouter.patch('/:id/block', asyncHandler(adminBlockUser));

export default authRouter;