import { BadRequestError } from '../errors/bad-request.error';
import { IProduct } from '../models/product.model';
import { ICreateProductParams, IUpdateProductParams, ProductRepository } from '../repository/product.repository';

class ProductService {
    constructor(private _productRepository: ProductRepository) { }

    async listActiveProducts(): Promise<IProduct[]> {
        return this._productRepository.getActiveProducts();
    }

    async getProductById(productId: string): Promise<IProduct> {
        const product = await this._productRepository.getById(productId);
        if (!product) {
        throw new BadRequestError('Product not found');
        }
        return product;
    }

    //ADMIN
    async adminListProducts(includeInactive: boolean): Promise<IProduct[]> {
        return this._productRepository.listAll(includeInactive);
    }

    async adminCreateProduct(params: ICreateProductParams): Promise<IProduct> {
        if (!params.name || !params.categoryId) {
        throw new BadRequestError('Name and categoryId are required');
        }

        return this._productRepository.createProduct(params);
    }

    async adminUpdateProduct(productId: string, params: IUpdateProductParams): Promise<IProduct> {
        const product = await this._productRepository.updateProduct(productId, params);
        if (!product) {
        throw new BadRequestError('Product not found');
        }
        return product;
    }

    async adminDeleteProduct(productId: string): Promise<IProduct> {
        const product = await this._productRepository.deleteProduct(productId);
        if (!product) {
        throw new BadRequestError('Product not found');
        }
        return product;
    }
}

export default new ProductService(new ProductRepository());