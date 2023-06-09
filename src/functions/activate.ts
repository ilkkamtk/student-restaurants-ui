import createAlert from '../components/createAlert';
import { doFetch } from './fetch';
import MessageResponse from '../interfaces/MessageResponse';
import { apiURL } from '../utils/variables';

const activate = async (token: string) => {
  // activate user
  console.log('gere');
  try {
    const userData = (await doFetch(
      apiURL + '/users/activate/' + token,
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
