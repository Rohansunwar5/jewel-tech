import userModel, { IUser, DealerStatus } from '../models/user.model';

export interface ICreateMinimalUserParams {
  isdCode: string;
  phoneNumber: string;
}

export interface IUpdateUserDetailsParams {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  buisnessName?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
}

export class UserRepository {
  private _model = userModel;

  async getByPhone(isdCode: string, phoneNumber: string): Promise<IUser | null> {
    return this._model.findOne({ isdCode, phoneNumber });
  }

  async getById(userId: string): Promise<IUser | null> {
    return this._model.findById(userId);
  }

  async createMinimalUser(params: ICreateMinimalUserParams): Promise<IUser> {
    return this._model.create({
      isdCode: params.isdCode,
      phoneNumber: params.phoneNumber,
      status: DealerStatus.PENDING,
      isBlocked: false,
    });
  }

  async updateDetails(params: IUpdateUserDetailsParams): Promise<IUser | null> {
    const update: {
      firstName?: string;
      lastName?: string;
      email?: string;
      buisnessName?: string;
      city?: string;
      state?: string;
      gstNumber?: string;
    } = {};

    if (params.firstName) {
      update.firstName = params.firstName;
    }
    if (params.lastName) {
      update.lastName = params.lastName;
    }
    if (params.email) {
      update.email = params.email;
    }
    if (params.buisnessName) {
      update.buisnessName = params.buisnessName;
    }
    if (params.city) {
      update.city = params.city;
    }
    if (params.state) {
      update.state = params.state;
    }
    if (params.gstNumber) {
      update.gstNumber = params.gstNumber;
    }

    return this._model.findByIdAndUpdate(
      params.userId,
      update,
      { new: true }
    );
  }

  async updateStatus(userId: string, status: DealerStatus): Promise<IUser | null> {
    return this._model.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
  }

  async blockUser(userId: string, isBlocked: boolean): Promise<IUser | null> {
    return this._model.findByIdAndUpdate(
      userId,
      { isBlocked: isBlocked },
      { new: true }
    );
  }

  async listUsers(status?: DealerStatus): Promise<IUser[]> {
    if (status) {
      return this._model.find({ status: status });
    }
    return this._model.find({});
  }
}
