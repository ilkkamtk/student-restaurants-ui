import { WeeklyMenu } from '../interfaces/Restaurant';

export default function createWMenu(menu: WeeklyMenu) {
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('day-menu');
  menu.days.forEach((menuItem) => {
    const day = document.createElement('h3');
    day.classList.add('day');
    day.textContent = menuItem.date;

    const menuList = document.createElement('ul');
    menuList.classList.add('menu-list');
    menuItem.courses.forEach((course) => {
      const menuItemElement = document.createElement('li');
      menuItemElement.classList.add('menu-item');

      const courseName = document.createElement('h4');
      courseName.textContent = course.name;
      menuItemElement.appendChild(courseName);

      const courseDiets = document.createElement('p');
      courseDiets.textContent = `Diets: ${course.diets}`;
      menuItemElement.appendChild(courseDiets);

      if (course.price) {
        const coursePrice = document.createElement('p');
        coursePrice.textContent = `Price: ${course.price}`;
        menuItemElement.appendChild(coursePrice);
      }

      menuList.appendChild(menuItemElement);
    });
    menuDiv.appendChild(day);
    menuDiv.appendChild(menuList);
  });
  return menuDiv;
}
