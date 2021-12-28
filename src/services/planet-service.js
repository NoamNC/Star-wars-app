import apiService from './api-service';

/**
 * @returns {Array}
 */
const getPlanets = () => {
  return apiService.getAll('planets');
};

/**
 * @param {Array} planets
 * @returns {Array}
 */
const formatPopulationToInt = (planets) => {
  return planets.map((planet) => {
    planet.population = planet.population === 'unknown' ? 0 : parseInt(planet.population);
    return { ...planet };
  });
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
  formatPopulationToInt,
  getPlanetsForChart,
};
