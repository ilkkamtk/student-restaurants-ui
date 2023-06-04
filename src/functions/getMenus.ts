import createDailyMenu from '../components/createDailyMenu';
import createWeeklyMenu from '../components/createWeeklyMenu';
import Environment from '../interfaces/Environment';
import { DailyMenu, WeeklyMenu } from '../interfaces/Restaurant';
import { doFetch } from './fetch';

const getTodaysMenu = async (id: string | undefined, env: Environment) => {
  try {
    const menu = (await doFetch(
      env.apiUrl + '/restaurants/daily/' + id + '/fi',
    )) as DailyMenu;
    console.log(menu);
    const dailyMenu = document.querySelector(
      '#menu-today',
    ) as HTMLDialogElement;
    dailyMenu.querySelector('.modal-body')!.innerHTML = '';
    const menuHTML = createDailyMenu(menu);
    dailyMenu.querySelector('.modal-body')!.appendChild(menuHTML);
    dailyMenu?.showModal();
  } catch (error) {
    console.log((error as Error).message);
  }
};

const getThisWeeksMenu = async (id: string | undefined, env: Environment) => {
  try {
    const menu = (await doFetch(
      (env.apiUrl as string) + '/restaurants/weekly/' + id + '/fi',
    )) as WeeklyMenu;
    console.log(menu);
    const weeklyMenu = document.querySelector(
      '#menu-week',
    ) as HTMLDialogElement;
    weeklyMenu.querySelector('.modal-body')!.innerHTML = '';
    const menuHTML = createWeeklyMenu(menu);
    weeklyMenu.querySelector('.modal-body')!.appendChild(menuHTML);
    weeklyMenu?.showModal();
  } catch (error) {
    console.log((error as Error).message);
  }
};

export { getTodaysMenu, getThisWeeksMenu };
