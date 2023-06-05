import serialize from 'form-serialize';
import Environment from '../interfaces/Environment';
import { doFetch } from '../functions/fetch';
import { UserResponse } from '../interfaces/User';
import createAlert from './createAlert';

export default (env: Environment): HTMLFormElement => {
  const registerForm = document.createElement('form');
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.innerHTML = 'Register';
  fieldset.appendChild(legend);
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
  fieldset.appendChild(usernameDiv);
  const emailDiv = document.createElement('div');
  emailDiv.classList.add('form-control');
  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.innerHTML = 'Email';
  emailDiv.appendChild(emailLabel);
  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('placeholder', 'Enter email');
  emailDiv.appendChild(emailInput);
  fieldset.appendChild(emailDiv);
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
  fieldset.appendChild(passwordDiv);
  const registerButton = document.createElement('button');
  registerButton.setAttribute('type', 'submit');
  registerButton.classList.add('btn');
  registerButton.innerHTML = 'Register';
  fieldset.appendChild(registerButton);
  registerForm.appendChild(fieldset);
  registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const registerData = serialize(registerForm, { hash: true });
    registerData.UIUrl = `${window.location.href}?activate=`;
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      };
      const userData = (await doFetch(
        env.apiUrl + '/users',
        options,
      )) as UserResponse;
      console.log(userData);
      if (userData.data) {
        createAlert(
          `Registration successful, activate your account with this link: <a href="${userData.activationUrl}">${userData.activationUrl}</a>`,
        );
      }
    } catch (error) {
      createAlert((error as Error).message);
    }
  });
  return registerForm;
};
