import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { BadRequestError } from '../errors/bad-request.error';

export const listActiveProducts = async (req: Request, res: Response, next: NextFunction) => {
  const response = await productService.listActiveProducts();

  next(response);
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const response = await productService.getProductById(id);

  next(response);
};

export const adminListProducts = async (req: Request, res: Response, next: NextFunction) => {
  const includeInactiveParam = req.query.includeInactive as string;
  let includeInactive = false;

  if (includeInactiveParam === 'true') {
    includeInactive = true;
  }

  const response = await productService.adminListProducts(includeInactive);

  next(response);
};

export const adminCreateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    sku,
    description,
    categoryId,
    images,
    weight,
    purity,
    makingChargesPerGram,
    isActive
  } = req.body;

  const response = await productService.adminCreateProduct({
    name: name,
    sku: sku,
    description: description,
    categoryId: categoryId,
    images: images,
    weight: weight,
    purity: purity,
    makingChargesPerGram: makingChargesPerGram,
    isActive: isActive
  });

  next(response);
};

export const adminUpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.id;

  if (!productId) {
    throw new BadRequestError('Product id is required');
  }

  const {
    name,
    sku,
    description,
    categoryId,
    images,
    weight,
    purity,
    makingChargesPerGram,
    isActive
  } = req.body;

  const response = await productService.adminUpdateProduct(productId, {
    name: name,
    sku: sku,
    description: description,
    categoryId: categoryId,
    images: images,
    weight: weight,
    purity: purity,
    makingChargesPerGram: makingChargesPerGram,
    isActive: isActive
  });

  next(response);
};


export const adminDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.id;

  if (!productId) {
    throw new BadRequestError('Product id is required');
  }

  const response = await productService.adminDeleteProduct(productId);
  next(response);
};

export const uploadAssets = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next({ status: 400, message: 'No file uploaded' });
  }

  const imageUrls = await productService.handleImageUploads({
    files: [req.file],
  });

  return res.status(200).json({
    success: true,
    images: imageUrls,
  });
};