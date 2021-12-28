import apiService from './api-service';

/**
 * @returns {Array}
 */
const getPeople = async () => {
  return await apiService.getAllDataFromCollection('people');
};

/**
 * 
 * @param {Array} people 
 * @returns {Array}
 */
const getVehiclePilots = (people) => {
  return people.filter((person) => {
    if (!!person.vehicles.length) {
      return person;
    }
  });
};

export default {
  getPeople,
  getVehiclePilots,
};
