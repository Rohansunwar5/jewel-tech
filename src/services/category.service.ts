import { BadRequestError } from "../errors/bad-request.error";
import { ICategory } from "../models/category.model";
import { CategoryRepository, ICreateCategoryParams, IUpdateCategoryParams } from "../repository/category.repository";

class CategoryService {
    constructor( private readonly _categoryRepository: CategoryRepository) {}
    
    async listActiveCategories() {
        return this._categoryRepository.getActiveCategories();
    }

    async getCategoryById(id: string): Promise<ICategory> {
        const cat = await this._categoryRepository.getById(id);
        if (!cat) {
        throw new BadRequestError('Category not found');
        }
        return cat;
    }

    async adminListCategories(includeInactive: boolean): Promise<ICategory[]> {
        return this._categoryRepository.listAll(includeInactive);
    }

    async adminCreateCategory(params: ICreateCategoryParams): Promise<ICategory> {
        if (!params.name) {
        throw new BadRequestError('Category name is required');
        }
        return this._categoryRepository.createCategory(params);
    }

    async adminUpdateCategory(id: string, params: IUpdateCategoryParams): Promise<ICategory> {
        const updated = await this._categoryRepository.updateCategory(id, params);
        if (!updated) {
        throw new BadRequestError('Category not found');
        }
        return updated;
    }

    async adminDeleteCategory(id: string): Promise<ICategory> {
        const deleted = await this._categoryRepository.deleteCategory(id);
        if (!deleted) {
        throw new BadRequestError('Category not found');
        }
        return deleted;
    }
}

export default new CategoryService(new CategoryRepository());