import { DailyMenu } from '../interfaces/Restaurant';

export default function createDailyMenu(date: string, menu: DailyMenu) {
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('day-menu');
  const day = document.createElement('h3');
  day.classList.add('day');
  day.textContent = date;
  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  menu.courses.forEach((course) => {
    const menuItemElement = document.createElement('li');
    menuItemElement.classList.add('menu-item');
    menuItemElement.innerHTML = `
          <h4>${course.name}</h4>
          <p>Diets: ${course.diets}</p>
          <p>Price: ${course.price}</p>
        `;
    menuList.appendChild(menuItemElement);
  });
  menuDiv.appendChild(day);
  menuDiv.appendChild(menuList);
  return menuDiv;
}
