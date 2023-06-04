import serialize from 'form-serialize';
import { doFetch } from '../functions/fetch';
import { UserResponse } from '../interfaces/User';
import createAlert from './createAlert';
import Environment from '../interfaces/Environment';

export default (env: Environment): HTMLFormElement => {
  const loginForm = document.createElement('form');
  const loginFieldset = document.createElement('fieldset');
  const loginLegend = document.createElement('legend');
  loginLegend.innerHTML = 'Login';
  loginFieldset.appendChild(loginLegend);
  const usernameDiv = document.createElement('div');
  usernameDiv.classList.add('form-control');
  const usernameLabel = document.createElement('label');
  usernameLabel.setAttribute('for', 'username');
  usernameLabel.innerHTML = 'Username';
  usernameDiv.appendChild(usernameLabel);
  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('type', 'text');
  usernameInput.setAttribute('name', 'username');
  usernameInput.setAttribute('placeholder', 'Enter username');
  usernameDiv.appendChild(usernameInput);
  loginFieldset.appendChild(usernameDiv);
  const passwordDiv = document.createElement('div');
  passwordDiv.classList.add('form-control');
  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerHTML = 'Password';
  passwordDiv.appendChild(passwordLabel);
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('placeholder', 'Enter password');
  passwordDiv.appendChild(passwordInput);
  loginFieldset.appendChild(passwordDiv);
  const loginButton = document.createElement('button');
  loginButton.setAttribute('type', 'submit');
  loginButton.classList.add('btn');
  loginButton.innerHTML = 'Login';
  loginFieldset.appendChild(loginButton);
  loginForm.appendChild(loginFieldset);
  loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const loginData = serialize(loginForm, { hash: true });
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      };
      const userData = (await doFetch(
        env.apiUrl + '/auth/login',
        options,
      )) as UserResponse;
      console.log(userData);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.data));
        createAlert('Login successful');
        loginForm.dispatchEvent(new CustomEvent('login-success'));
      }
    } catch (error) {
      createAlert((error as Error).message);
    }
  });
  return loginForm;
};
