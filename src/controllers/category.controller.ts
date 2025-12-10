import { Request, NextFunction, Response } from "express";
import categoryService from "../services/category.service";

export const listActiveCategories = async (req: Request, res: Response, next: NextFunction) => {
  const response = await categoryService.listActiveCategories();
  
  next(response);
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const response = await categoryService.getCategoryById(id);

  next(response);
};

// ADMIN CONTROLLERS

export const adminListCategories = async (req: Request, res: Response, next: NextFunction) => {
  const includeInactiveParam = req.query.includeInactive as string | undefined;
  let includeInactive = false;

  if (includeInactiveParam === 'true') {
    includeInactive = true;
  }

  const response = await categoryService.adminListCategories(includeInactive);
  next(response);
};

export const adminCreateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, image, isActive } = req.body;

  const response = await categoryService.adminCreateCategory({
    name: name,
    description: description,
    image: image,
    isActive: isActive
  });

  next(response);
};

export const adminUpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, description, image, isActive } = req.body;

  const response = await categoryService.adminUpdateCategory(id, {
    name: name,
    description: description,
    image: image,
    isActive: isActive
  });

  next(response);
};

export const adminDeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const response = await categoryService.adminDeleteCategory(id);
  next(response);
};