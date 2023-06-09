import { doFetch } from '../functions/fetch';
import { getThisWeeksMenu, getTodaysMenu } from '../functions/getMenus';
import { Restaurant } from '../interfaces/Restaurant';
import { apiURL, googleApiKey } from '../utils/variables';
import createAlert from './createAlert';

export default (restaurant: Restaurant): HTMLDivElement => {
  const popupDiv = document.createElement('div');
  popupDiv.classList.add('flex', 'flex-col');
  const name = document.createElement('h3');
  name.classList.add('text-lg');
  name.textContent = `${restaurant.name} - ${restaurant.company}`;
  const address = document.createElement('p');
  address.textContent = restaurant.address;
  const postalCode = document.createElement('p');
  postalCode.textContent = `${restaurant.postalCode} ${restaurant.city}`;
  const image = document.createElement('img');
  image.src =
    'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' +
    restaurant.address +
    ',' +
    restaurant.postalCode +
    ',' +
    restaurant.city +
    '&key=' +
    googleApiKey;
  image.alt = restaurant.name;
  const viewDailyMenu = document.createElement('button');
  viewDailyMenu.classList.add('popup-btn', 'view-daily-menu');
  viewDailyMenu.textContent = "View today's menu";
  const viewWeeklyMenu = document.createElement('button');
  viewWeeklyMenu.classList.add('popup-btn', 'view-weekly-menu');
  viewWeeklyMenu.textContent = "View this week's menu";
  const addFavourite = document.createElement('button');
  addFavourite.classList.add('popup-btn', 'add-favourite');
  addFavourite.textContent = 'Add as favourite';
  popupDiv.append(
    name,
    address,
    postalCode,
    image,
    viewDailyMenu,
    viewWeeklyMenu,
    addFavourite,
  );
  // button events
  viewDailyMenu.addEventListener('click', async () => {
    getTodaysMenu(restaurant._id);
  });

  viewWeeklyMenu.addEventListener('click', async () => {
    getThisWeeksMenu(restaurant._id);
  });

  addFavourite.addEventListener('click', async () => {
    if (!localStorage.getItem('token')) {
      createAlert('You must be logged in to add a favourite restaurant');
      return;
    }
    try {
      const userData = await doFetch(apiURL + '/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          favouriteRestaurant: restaurant._id,
        }),
      });
      localStorage.setItem('user', JSON.stringify(userData.data));
      popupDiv.dispatchEvent(new Event('favourite-added'));
    } catch (error) {
      createAlert((error as Error).message);
    }
  });

  return popupDiv;
};
