import { doFetch } from '../functions/fetch';
import Environment from '../interfaces/Environment';
import { Restaurant, WeeklyMenu } from '../interfaces/Restaurant';
import createWMenu from './createWeeklyMenu';

export default function createPopup(restaurant: Restaurant, env: Environment) {
  const popupDiv = document.createElement('div');
  popupDiv.classList.add('flex', 'flex-col');
  const name = document.createElement('h3');
  name.classList.add('text-lg');
  name.textContent = `${restaurant.name} - ${restaurant.company}`;
  const address = document.createElement('p');
  address.textContent = restaurant.address;
  const postalCode = document.createElement('p');
  postalCode.textContent = `${restaurant.postalCode} ${restaurant.city}`;
  const viewDailyMenu = document.createElement('button');
  viewDailyMenu.classList.add('popup-btn', 'view-daily-menu');
  viewDailyMenu.dataset.id = restaurant._id;
  viewDailyMenu.textContent = "View today's menu";
  const viewWeeklyMenu = document.createElement('button');
  viewWeeklyMenu.classList.add('popup-btn', 'view-weekly-menu');
  viewWeeklyMenu.dataset.id = restaurant._id;
  viewWeeklyMenu.textContent = "View this week's menu";
  const addFavourite = document.createElement('button');
  addFavourite.classList.add('popup-btn', 'add-favourite');
  addFavourite.dataset.id = restaurant._id;
  addFavourite.textContent = 'Add as favourite';
  popupDiv.append(
    name,
    address,
    postalCode,
    viewDailyMenu,
    viewWeeklyMenu,
    addFavourite,
  );
  // button events
  viewDailyMenu.addEventListener('click', async (evt) => {
    try {
      const menu = await doFetch(
        env.apiUrl +
          '/restaurants/daily/' +
          (evt.currentTarget as HTMLElement).dataset.id +
          '/fi',
      );
      console.log(menu);
    } catch (error) {
      console.log((error as Error).message);
    }
  });

  viewWeeklyMenu.addEventListener('click', async (evt) => {
    try {
      const menu = (await doFetch(
        (env.apiUrl as string) +
          '/restaurants/weekly/' +
          (evt.currentTarget as HTMLElement).dataset.id +
          '/fi',
      )) as WeeklyMenu;
      console.log(menu);
      const weeklyMenu = document.querySelector(
        '#menu-week',
      ) as HTMLDialogElement;
      weeklyMenu.querySelector('.modal-body')!.innerHTML = '';
      const menuHTML = createWMenu(menu);
      weeklyMenu.querySelector('.modal-body')!.appendChild(menuHTML);
      weeklyMenu?.showModal();
    } catch (error) {
      console.log((error as Error).message);
    }
  });

  addFavourite.addEventListener('click', (evt) => {
    console.log((evt.currentTarget as HTMLElement).dataset.id);
    try {
      const favourite = doFetch((env.apiUrl as string) + '/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          favouriteRestaurant: (evt.currentTarget as HTMLElement).dataset.id,
        }),
      });
      console.log(favourite);
    } catch (error) {}
  });

  return popupDiv;
}
