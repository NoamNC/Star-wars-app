import apiService from './api-service';

/**
 * @returns {Array}
 */
const getPlanets = async () => {
  return await apiService.getAllDataFromCollection('planets');
};

/**
 * @param {Array} planets
 * @returns {Array}
 */
const changePopulationToInt = (planets) => {
  const planetsCopy = [];
  planets.forEach((planet, index) => {
    planetsCopy.push({ ...planet });
    planetsCopy[index].population =
      planet.population === 'unknown' ? 0 : parseInt(planet.population);
  });
  return planetsCopy;
};

export default {
  getPlanets,
  changePopulationToInt,
};
