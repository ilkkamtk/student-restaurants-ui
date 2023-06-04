import createAlert from '../components/createAlert';
import { doFetch } from './fetch';
import loadEnvironment from './loadEnvironment';
import Environment from '../interfaces/Environment';
import MessageResponse from '../interfaces/MessageResponse';

const activate = async (token: string) => {
  // activate user
  console.log('gere');
  try {
    const env = (await loadEnvironment()) as Environment;
    const userData = (await doFetch(
      env.apiUrl + '/users/activate/' + token,
    )) as MessageResponse;

    if (userData.message) {
      createAlert(userData.message);
      // clear query params
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      createAlert('Something went wrong');
    }
  } catch (error) {
    console.log(error);
  }
};

export default activate;
