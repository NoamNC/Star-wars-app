import apiService from './api-service';

/**
 * @returns {Array}
 */
const getPeople = () => {
  return apiService.getAll('people');
};

/**
 * @param {Object} person
 * @returns {Boolean}
 */
function hasVehicles(person) {
  return !!person.vehicles.length;
}

/**
 * @param {Array} people
 * @returns {Array}
 */
const getVehiclePilots = (people) => {
  return people.filter((person) => hasVehicles(person));
};

export default {
  getPeople,
  getVehiclePilots,
};
