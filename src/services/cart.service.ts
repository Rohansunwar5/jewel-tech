import { BadRequestError } from '../errors/bad-request.error';
import { CartRepository } from '../repository/cart.repository';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from '../repository/user.repository';

class CartService {
    constructor(
        private readonly _cartRepository: CartRepository,
        private readonly _userRepository: UserRepository,
        private readonly _productRepository: ProductRepository
    ) {}

    async getCart(userId: string) {
        let cart = await this._cartRepository.getCart(userId);
        if(!cart) {
            cart = await this._cartRepository.createCart(userId);
        }
        return cart;
    }

    async add(params: { userId: string, productId: string, quantity: number, note?: string }) {
        const cart = await this.getCart(params.userId);
        const product = await this._productRepository.getById(params.productId);

        if(!product) throw new BadRequestError('Product not found');

        const updatedItems: { productId: string; quantity: number; note?: string }[] = [];
        let found = false;

        for (let i = 0; i < cart.items.length; i++) {
            const item = cart.items[i];

            if(item.productId === params.productId) {
                const newQuantity = item.quantity + params.quantity;
                const newNote = params.note ? params.note : item.note;
                updatedItems.push({ productId: item.productId, quantity: newQuantity, note: newNote });
                found = true;
            } else {
                updatedItems.push({ productId: item.productId, quantity: item.quantity, note: item.note });
            }
        }

        if(!found) {
            updatedItems.push({ productId: params.productId, quantity: params.quantity, note: params.note });
        }

        return this._cartRepository.updateItems(params.userId, updatedItems);
    }

    async remove(userId: string, productId: string) {
        const cart = await this.getCart(userId);
        const updatedItems: { productId: string; quantity: number; note?: string }[] = [];

        for (let i = 0; i < cart.items.length; i++) {
            const item = cart.items[i];
            if(item.productId !== productId) {
                updatedItems.push({ productId: item.productId, quantity: item.quantity, note: item.note });
            }
        }

        return this._cartRepository.updateItems(userId, updatedItems);
    }

    async clear(userId: string) {
        return this._cartRepository.clear(userId);
    }

    async generateEnquiry(userId: string) {
        const cart = await this.getCart(userId);

        if(cart.items.length === 0) {
            throw new BadRequestError('Cart is empty');
        }

        const user = await this._userRepository.getById(userId);
        if(!user) throw new BadRequestError('User not found');

        let text = 'Enquiry From Dealer:\n';

        const fullName = user.firstName ? user.firstName + (user.lastName ? ' ' + user.lastName: '') : 'N/A';

        text += 'Name: ' + fullName + '\n';
        text += 'Business: ' + (user.buisnessName || 'N/A') + '\n';
        text += 'Phone: +' + user.isdCode + ' ' + user.phoneNumber + '\n';
        text += 'City: ' + (user.city || 'N/A') + '\n';
        text += 'State: ' + (user.state || 'N/A') + '\n';
        text += '\nProducts:\n';

        for (let i = 0; i < cart.items.length; i++) {
            const item = cart.items[i];
            const product = await this._productRepository.getById(item.productId);

            if(product) {
                text +=
                (i + 1) +
                ') ' +
                product.name +
                ' (SKU: ' +
                (product.sku || '') +
                ') - Qty: ' +
                item.quantity +
                '\n';
            }
        }

        text += `\nPlease share pricing and availability.`;

        return text;
    }
}

export default new CartService(new CartRepository(), new UserRepository(), new ProductRepository());