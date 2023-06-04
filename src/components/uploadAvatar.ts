import { doFetch } from '../functions/fetch';
import Environment from '../interfaces/Environment';
import { UserResponse } from '../interfaces/User';
import createAlert from './createAlert';

export default (env: Environment): HTMLFormElement => {
  const uploadForm = document.createElement('form');
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.innerHTML = 'Upload Avatar Image';
  fieldset.appendChild(legend);
  const formControl = document.createElement('div');
  formControl.classList.add('form-control');
  const label = document.createElement('label');
  label.setAttribute('for', 'avatar');
  label.innerHTML = 'Avatar';
  formControl.appendChild(label);
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('name', 'avatar');
  input.setAttribute('accept', 'image/*');
  formControl.appendChild(input);
  fieldset.appendChild(formControl);
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.classList.add('btn');
  button.innerHTML = 'Upload';
  fieldset.appendChild(button);
  uploadForm.appendChild(fieldset);
  uploadForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const formData = new FormData(uploadForm);
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      };
      const userData = (await doFetch(
        env.apiUrl + '/users/avatar',
        options,
      )) as UserResponse;

      if (userData.data) {
        createAlert('Avatar uploaded successfully');
        uploadForm.dispatchEvent(new CustomEvent('avatar-uploaded'));
      }
    } catch (error) {
      console.log(error);
    }
  });
  return uploadForm;
};