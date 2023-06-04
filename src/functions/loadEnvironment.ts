import Environment from '../interfaces/Environment';
import { doFetch } from './fetch';

const loadEnvironment = async (): Promise<Environment> => {
  const url =
    import.meta.env.MODE === 'development' ? 'local.env.json' : 'env.json';

  try {
    return await doFetch(url);
  } catch (error) {
    console.log((error as Error).message);
    return { apiUrl: '', mapboxToken: '', uploadUrl: '', googleApiKey: '' };
  }
};

export default loadEnvironment;
