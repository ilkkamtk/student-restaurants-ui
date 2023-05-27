interface User {
  _id: string;
  username: string;
  password: string;
  favouriteRestaurant?: string;
  avatar?: string;
  role: 'admin' | 'user';
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
  };
  token?: string;
}

export type { User, UpdateUser, UserResponse };
