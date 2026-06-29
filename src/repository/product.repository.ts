import productModel, { IProduct } from '../models/product.model';

export interface IProductSpec {
  label?: string;
  value?: string;
}

export interface ICreateProductParams {
  name: string;
  sku?: string;
  description?: string;
  categoryId: string;
  images?: string[];
  weight?: number;
  purity?: string;
  makingChargesPerGram?: number;
  specifications?: IProductSpec[];
  isActive?: boolean;
}

export interface IUpdateProductParams {
  name?: string;
  sku?: string;
  description?: string;
  categoryId?: string;
  images?: string[];
  weight?: number;
  purity?: string;
  makingChargesPerGram?: number;
  specifications?: IProductSpec[];
  isActive?: boolean;
}

export class ProductRepository {
  private _model = productModel;

  async getActiveProducts() {
    return this._model.find({ isActive: true });
  }

  async getAll(): Promise<IProduct[]> {
    return this._model.find({ isActive: true });
  }

  async getById(id: string): Promise<IProduct | null> {
    return this._model.findById(id);
  }

  async existsBySku(sku: string): Promise<boolean> {
    const found = await this._model.exists({ sku });
    return Boolean(found);
  }

  async listAll(includeInactive: boolean): Promise<IProduct[]> {
    if (includeInactive) {
      return this._model.find({});
    }
    return this._model.find({ isActive: true });
  }

  async createProduct(params: ICreateProductParams): Promise<IProduct> {
    return this._model.create({
      name: params.name,
      sku: params.sku,
      description: params.description,
      categoryId: params.categoryId,
      images: params.images || [],
      weight: params.weight,
      purity: params.purity,
      makingChargesPerGram: params.makingChargesPerGram,
      specifications: params.specifications || [],
      isActive: typeof params.isActive === 'boolean' ? params.isActive : true,
    });
  }

  async updateProduct(id: string, params: IUpdateProductParams): Promise<IProduct | null> {
    const update: {
      name?: string;
      sku?: string;
      description?: string;
      categoryId?: string;
      images?: string[];
      weight?: number;
      purity?: string;
      makingChargesPerGram?: number;
      specifications?: IProductSpec[];
      isActive?: boolean;
    } = {};

    if (params.name) {
      update.name = params.name;
    }
    if (params.sku) {
      update.sku = params.sku;
    }
    if (params.description) {
      update.description = params.description;
    }
    if (params.categoryId) {
      update.categoryId = params.categoryId;
    }
    if (params.images) {
      update.images = params.images;
    }
    if (typeof params.weight === 'number') {
      update.weight = params.weight;
    }
    if (params.purity) {
      update.purity = params.purity;
    }
    if (typeof params.makingChargesPerGram === 'number') {
      update.makingChargesPerGram = params.makingChargesPerGram;
    }
    if (params.specifications) {
      update.specifications = params.specifications;
    }
    if (typeof params.isActive === 'boolean') {
      update.isActive = params.isActive;
    }

    return this._model.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return this._model.findByIdAndDelete(id);
  }

}
