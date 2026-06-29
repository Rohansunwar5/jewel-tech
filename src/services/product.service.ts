import { BadRequestError } from '../errors/bad-request.error';
import { IProduct } from '../models/product.model';
import { ICreateProductParams, IUpdateProductParams, ProductRepository } from '../repository/product.repository';
import uploadService from './upload.service';

class ProductService {
  constructor(private readonly _productRepository: ProductRepository) {}

  async listActiveProducts(): Promise<IProduct[]> {
    return this._productRepository.getActiveProducts();
  }

  async getProductById(productId: string): Promise<IProduct> {
    const product = await this._productRepository.getById(productId);
    if (!product) throw new BadRequestError('Product not found');
    return product;
  }

  // ADMIN
  async adminListProducts(includeInactive: boolean): Promise<IProduct[]> {
    return this._productRepository.listAll(includeInactive);
  }

  async adminCreateProduct(params: ICreateProductParams): Promise<IProduct> {
    if (!params.name || !params.categoryId) {
      throw new BadRequestError('Name and categoryId are required');
    }
    if (!params.sku || !params.sku.trim()) {
      params.sku = await this.generateUniqueSku();
    }
    return this._productRepository.createProduct(params);
  }

  // Random SKU like "RJ-K7Q2M9" verified absent from the DB
  private async generateUniqueSku(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
      const sku = `RJ-${rand}`;
      if (!(await this._productRepository.existsBySku(sku))) {
        return sku;
      }
    }
    // extremely unlikely fallback: timestamp guarantees uniqueness
    return `RJ-${Date.now().toString(36).toUpperCase()}`;
  }

  async adminUpdateProduct(productId: string, params: IUpdateProductParams): Promise<IProduct> {
    const product = await this._productRepository.updateProduct(productId, params);
    if (!product) throw new BadRequestError('Product not found');
    return product;
  }

  async adminDeleteProduct(productId: string): Promise<IProduct> {
    const product = await this._productRepository.deleteProduct(productId);
    if (!product) throw new BadRequestError('Product not found');
    return product;
  }

  async handleImageUploads(params: {
    files?: Express.Multer.File[];
    existingImages?: string[];
  }): Promise<string[]> {
    let imageUrls: string[] = [];

    if (params.existingImages) {
      imageUrls = Array.isArray(params.existingImages)
        ? params.existingImages
        : [params.existingImages];
    }

    if (params.files && params.files.length > 0) {
      const uploads = await Promise.all(
        params.files.map((file) => uploadService.uploadToS3(file, 'products'))
      );
      imageUrls = [...imageUrls, ...uploads.map((u) => u.url)];
    }

    if (imageUrls.length === 0) {
      throw new BadRequestError('At least one product image is required');
    }

    return imageUrls;
  }
}

export default new ProductService(new ProductRepository());
