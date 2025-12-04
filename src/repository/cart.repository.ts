import cartModel, { ICart, ICartItem } from '../models/cart.model';

export class CartRepository {
  private _model = cartModel;

  async getCart(userId: string): Promise<ICart | null> {
    return this._model.findOne({ userId });
  }

  async createCart(userId: string): Promise<ICart> {
    return this._model.create({
      userId: userId,
      items: [],
    });
  }

  async updateItems(userId: string, items: ICartItem[]): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId },
      { items: items },
      { new: true }
    );
  }

  async clear(userId: string): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );
  }
}
