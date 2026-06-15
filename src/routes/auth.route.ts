import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { adminBlockUser, adminGetUserById, adminListUsers, adminUpdateStatus, login, profile, register, updateProfile, verifyOtp } from '../controllers/auth.controller';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { loginValidator, registerValidator, verifyOtpValidator } from '../middlewares/validators/auth.validator';

const authRouter = Router();

authRouter.post('/register', registerValidator, asyncHandler(register));
authRouter.post('/login', loginValidator, asyncHandler(login));
authRouter.post('/verify-otp', verifyOtpValidator, asyncHandler(verifyOtp));
authRouter.get('/profile', isLoggedIn, asyncHandler(profile));
authRouter.patch('/profile', isLoggedIn, asyncHandler(updateProfile));

// admin   //TODO: protect with admin auth middleware
authRouter.get('/list-users', asyncHandler(adminListUsers));
authRouter.get('/user/:id', asyncHandler(adminGetUserById));
authRouter.patch('/:id/status', asyncHandler(adminUpdateStatus));
authRouter.patch('/:id/block', asyncHandler(adminBlockUser));

export default authRouter;
