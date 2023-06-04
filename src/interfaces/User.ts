interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  favouriteRestaurant?: string;
  avatar?: string;
  role: 'admin' | 'user';
  activated: boolean;
}

type UpdateUser = Partial<User>;

interface UserResponse {
  message: string;
  data: {
    username: string;
    favouriteRestaurant?: string;
    _id: string;
    avatar?: string;
    role: 'admin' | 'user';
    activated: boolean;
    email: string;
  };
  token?: string;
  activationUrl?: string;
}

export type { User, UpdateUser, UserResponse };
