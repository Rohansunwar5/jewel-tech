import categoryModel, { ICategory } from "../models/category.model";

export interface ICreateCategoryParams {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface IUpdateCategoryParams {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export class CategoryRepository {
    private _model = categoryModel;

    async getActiveCategories() {
        return this._model.find({ isActive: true });
    }

    async getById(id: string) {
        return this._model.findById(id);
    }

    async listAll(includeInactive: boolean) {
        if (includeInactive) {
        return this._model.find({});
        }
        return this._model.find({ isActive: true });
    }

    async createCategory(params: ICreateCategoryParams): Promise<ICategory> {
        return this._model.create({
        name: params.name,
        description: params.description,
        image: params.image,
        isActive: typeof params.isActive === 'boolean' ? params.isActive : true
        });
    }

    async updateCategory(id: string, params: IUpdateCategoryParams): Promise<ICategory | null> {
        const update: {
        name?: string;
        description?: string;
        image?: string;
        isActive?: boolean;
        } = {};

        if (params.name) update.name = params.name;
        if (params.description) update.description = params.description;
        if (params.image) update.image = params.image;
        if (typeof params.isActive === 'boolean') update.isActive = params.isActive;

        return this._model.findByIdAndUpdate(id, update, { new: true });
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        return this._model.findByIdAndDelete(id);
    }
}