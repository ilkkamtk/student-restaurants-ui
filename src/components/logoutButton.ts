import createAlert from './createAlert';

export default (): HTMLFieldSetElement => {
  const logoutFieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.innerHTML = 'Logout';
  logoutFieldset.appendChild(legend);
  const logoutButton = document.createElement('button');
  logoutButton.id = 'logout-btn';
  logoutButton.innerHTML = 'Logout';
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    createAlert('Logout successful');
    logoutFieldset.dispatchEvent(new CustomEvent('logout-success'));
  });
  logoutFieldset.appendChild(logoutButton);
  return logoutFieldset;
};
