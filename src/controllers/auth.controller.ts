import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, phoneNumber, isdCode, buisnessName, city, state, gstNumber } = req.body;
  const response = await authService.register({
    firstName, lastName, email, phoneNumber, isdCode, buisnessName, city, state, gstNumber,
  });

  next(response);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const response = await authService.login(email);
  next(response);
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  const response = await authService.verifyOtp({ email, otp });

  next(response);
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await authService.profile(_id);

  next(response);
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { firstName, lastName, email, buisnessName, city, state, gstNumber } = req.body;

  const response = await authService.updateProfile({
    userId: _id,
    firstName,
    lastName,
    email,
    buisnessName,
    city,
    state,
    gstNumber

  });

  next(response);
};

export const adminListUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await authService.adminListUsers(status as any);

  next(response);
};

export const adminGetUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const response = await authService.adminGetUserById(id);

  next(response);
};

export const adminUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const response = await authService.adminUpdateStatus(id, status);

  next(response);
};

export const adminBlockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { isBlocked } = req.body;
  const response = await authService.adminBlockUser(id, isBlocked);

  next(response);
};