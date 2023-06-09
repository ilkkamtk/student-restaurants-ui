import { doFetch } from '../functions/fetch';
import { getThisWeeksMenu, getTodaysMenu } from '../functions/getMenus';
import { Restaurant } from '../interfaces/Restaurant';
import { apiURL, googleApiKey } from '../utils/variables';

export default async (id: string | undefined) => {
  const restaurantModal = document.querySelector(
    '#restaurant-info',
  ) as HTMLDialogElement;
  const restaurantData = (await doFetch(
    `${apiURL}/restaurants/${id}`,
  )) as Restaurant;
  const restaurantModalContent = restaurantModal.querySelector('.modal-body');
  restaurantModalContent!.innerHTML = '';

  const restaurantCard = document.createElement('div');
  restaurantCard.classList.add('restaurant-card');
  const restaurantName = document.createElement('h3');
  restaurantName.innerHTML = restaurantData.name;
  restaurantCard.appendChild(restaurantName);
  const restaurantAddress = document.createElement('p');
  restaurantAddress.innerHTML = `${restaurantData.address}, ${restaurantData.city}`;
  restaurantCard.appendChild(restaurantAddress);
  const restaurantImage = document.createElement('img');
  restaurantImage.src =
    'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' +
    restaurantData.address +
    '&key=' +
    googleApiKey;
  restaurantImage.alt = 'street view of ' + restaurantData.name;
  restaurantCard.appendChild(restaurantImage);
  restaurantCard.appendChild(document.createElement('hr'));
  const weeklyMenuButton = document.createElement('button');
  weeklyMenuButton.innerHTML = `This Week's Menu`;
  weeklyMenuButton.addEventListener('click', () => {
    getThisWeeksMenu(restaurantData._id);
  });
  restaurantCard.appendChild(weeklyMenuButton);
  const dailyMenuButton = document.createElement('button');
  dailyMenuButton.innerHTML = `Today's Menu`;
  dailyMenuButton.addEventListener('click', () => {
    getTodaysMenu(restaurantData._id);
  });
  restaurantCard.appendChild(dailyMenuButton);
  restaurantModalContent?.appendChild(restaurantCard);
  return restaurantModal;
};
