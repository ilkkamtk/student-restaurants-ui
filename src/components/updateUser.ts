import serialize from 'form-serialize';
import { doFetch } from '../functions/fetch';
import { UserResponse } from '../interfaces/User';
import Environment from '../interfaces/Environment';

export default (env: Environment): HTMLFormElement => {
  const updateForm = document.createElement('form');
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.innerHTML = 'Update User';
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
  usernameInput.setAttribute('autocapitalize', 'none');
  usernameInput.setAttribute('minlength', '3');
  usernameDiv.appendChild(usernameInput);
  fieldset.appendChild(usernameDiv);
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
  passwordInput.setAttribute('minlength', '5');
  passwordDiv.appendChild(passwordInput);
  fieldset.appendChild(passwordDiv);
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
  const updateButton = document.createElement('button');
  updateButton.setAttribute('type', 'submit');
  updateButton.classList.add('btn');
  updateButton.innerHTML = 'Update';
  fieldset.appendChild(updateButton);
  updateForm.appendChild(fieldset);
  updateForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const updateData = serialize(updateForm, { hash: true });
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      };
      const userData = (await doFetch(
        env.apiUrl + '/users',
        options,
      )) as UserResponse;
      localStorage.setItem('user', JSON.stringify(userData.data));
      updateForm.dispatchEvent(new CustomEvent('user-updated'));
    } catch (err) {
      console.log(err);
    }
  });
  return updateForm;
};
