import { NextFunction, Request, Response } from 'express';
import { DealerStatus } from '../models/user.model';
import { UnauthorizedError } from '../errors/unauthorized.error';
import authService from '../services/auth.service';

export default async function isApprovedDealer(req: Request, res: Response, next: NextFunction) {
  // must be logged in first
  if (!req.user || !req.user._id) {
    throw new UnauthorizedError('Not authenticated');
  }

  // fetch full user to check status
  const user = await authService.profile(req.user._id);

  if (user.isBlocked) {
    throw new UnauthorizedError('User is blocked. Contact support.');
  }

  // user has not completed profile
  const hasDetails =
    user.firstName ||
    user.lastName ||
    user.buisnessName ||
    user.email;

  if (!hasDetails) {
    throw new UnauthorizedError('Please complete your profile details.');
  }

  // user has filled details but is pending admin approval
  if (user.status !== DealerStatus.APPROVED) {
    throw new UnauthorizedError('Your account is pending admin approval.');
  }

  // user is approved, continue to route
  next();
}
