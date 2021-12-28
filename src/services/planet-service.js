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
/**
 * @param {Array} planetNames
 * @param {Array} planets
 * @returns {Array}
 */
const getPlanetsForChart = (planets) => {
  const planetsForChart = new Set(['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']);
  const chartPlanets = [];
  planets.forEach((planet) => {
    if (planetsForChart.has(planet.name)) {
      chartPlanets.push({ ...planet });
    }
  });
  return chartPlanets;
};

export default {
  getPlanets,
  changePopulationToInt,
  getPlanetsForChart,
};
