import createDailyMenu from '../components/createDailyMenu';
import createWeeklyMenu from '../components/createWeeklyMenu';
import { DailyMenu, WeeklyMenu } from '../interfaces/Restaurant';
import { apiURL } from '../utils/variables';
import { doFetch } from './fetch';

const getTodaysMenu = async (id: string | undefined) => {
  try {
    const menu = (await doFetch(
      apiURL + '/restaurants/daily/' + id + '/en',
    )) as DailyMenu;
    console.log(menu);
    const dailyMenu = document.querySelector(
      '#menu-today',
    ) as HTMLDialogElement;
    dailyMenu.querySelector('.modal-body')!.innerHTML = '';
    let menuHTML: HTMLDivElement;
    if (menu.courses.length === 0) {
      menuHTML = document.createElement('div');
      menuHTML.innerHTML = '<p>No menu available today</p>';
    } else {
      menuHTML = createDailyMenu(menu);
    }
    dailyMenu.querySelector('.modal-body')!.appendChild(menuHTML);
    dailyMenu?.showModal();
  } catch (error) {
    console.log((error as Error).message);
  }
};

const getThisWeeksMenu = async (id: string | undefined) => {
  try {
    const menu = (await doFetch(
      apiURL + '/restaurants/weekly/' + id + '/en',
    )) as WeeklyMenu;
    console.log(menu);
    const weeklyMenu = document.querySelector(
      '#menu-week',
    ) as HTMLDialogElement;
    weeklyMenu.querySelector('.modal-body')!.innerHTML = '';
    let menuHTML: HTMLDivElement;
    if (menu.days.length === 0) {
      menuHTML = document.createElement('div');
      menuHTML.innerHTML = '<p>No menu available this week</p>';
    } else {
      menuHTML = createWeeklyMenu(menu);
    }
    weeklyMenu.querySelector('.modal-body')!.appendChild(menuHTML);
    weeklyMenu?.showModal();
  } catch (error) {
    console.log((error as Error).message);
  }
};

export { getTodaysMenu, getThisWeeksMenu };
