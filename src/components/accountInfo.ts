export default () => {
  const userInfo = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.innerHTML = 'User Info';
  userInfo.appendChild(legend);
  const username = document.createElement('h3');
  userInfo.appendChild(username);
  const email = document.createElement('p');
  userInfo.appendChild(email);
  const avatar = document.createElement('img');
  avatar.alt = 'avatar';
  userInfo.appendChild(avatar);
  const favouriteRestaurant = document.createElement('p');
  favouriteRestaurant.innerHTML = 'Favourite restaurant: ';
  userInfo.appendChild(favouriteRestaurant);
  const favouriteButton = document.createElement('button');
  userInfo.appendChild(favouriteButton);
  return {
    userInfo,
    username,
    email,
    avatar,
    favouriteButton,
  };
};
