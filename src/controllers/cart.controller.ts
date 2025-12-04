import { Request, Response, NextFunction } from 'express';
import cartService from '../services/cart.service';
import { BadRequestError } from '../errors/bad-request.error';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const authUser = req.user as { _id: string };
  if (!authUser || !authUser._id) {
    throw new BadRequestError('User not authenticated');
  }

  const cart = await cartService.getCart(authUser._id);
  next(cart);
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const authUser = req.user as { _id: string };
  if (!authUser || !authUser._id) {
    throw new BadRequestError('User not authenticated');
  }

  const { productId, quantity, note } = req.body;

  const response = await cartService.add({
    userId: authUser._id,
    productId,
    quantity,
    note,
  });

  next(response);
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  const authUser = req.user as { _id: string };
  if (!authUser || !authUser._id) {
    throw new BadRequestError('User not authenticated');
  }

  const { productId } = req.body;

  const response = await cartService.remove(authUser._id, productId);
  next(response);
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  const authUser = req.user as { _id: string };
  if (!authUser || !authUser._id) {
    throw new BadRequestError('User not authenticated');
  }

  const response = await cartService.clear(authUser._id);
  next(response);
};

export const generateEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  const authUser = req.user as { _id: string };
  if (!authUser || !authUser._id) {
    throw new BadRequestError('User not authenticated');
  }

  const message = await cartService.generateEnquiry(authUser._id);

  next({ message });
};
