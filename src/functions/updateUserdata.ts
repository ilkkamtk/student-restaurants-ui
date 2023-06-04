import Environment from '../interfaces/Environment';
import { Restaurant } from '../interfaces/Restaurant';
import { User } from '../interfaces/User';
import { doFetch } from './fetch';

const updateUserData = async (
  env: Environment,
  username: HTMLHeadingElement,
  email: HTMLParagraphElement,
  avatar: HTMLImageElement,
  favouriteButton: HTMLButtonElement,
): Promise<User | null> => {
  const token = localStorage.getItem('token') as string;
  if (!token) {
    return null;
  }

  const userData = (await doFetch(env.apiUrl + '/users/token', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as User;

  localStorage.setItem('user', JSON.stringify(userData));

  username.innerHTML = userData.username;

  email.innerHTML = userData.email;

  avatar.src = userData.avatar
    ? env.uploadUrl + userData.avatar
    : 'https://via.placeholder.com/150';

  if (userData.favouriteRestaurant) {
    const favouriteData = (await doFetch(
      env.apiUrl + '/restaurants/' + userData.favouriteRestaurant,
    )) as Restaurant;
    favouriteButton.innerHTML = favouriteData.name;
  }

  return userData;
};

export default updateUserData;
