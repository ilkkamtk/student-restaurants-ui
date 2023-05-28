const loadEnvironment = async () => {
  const url =
    import.meta.env.MODE === 'development' ? 'local.env.json' : 'env.json';

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log((error as Error).message);
  }
};

export default loadEnvironment;
