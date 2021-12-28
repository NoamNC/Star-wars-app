import apiService from './api-service';
import planetService from './planet-service';
import peopleService from './people-service';
import { hashMap } from '../utils/hash-map';

/**
 * @returns {Array}
 */
const getVehicles = () => {
  return apiService.getAll('vehicles');
};

/**
 * @param {Object} vehicle
 * @returns {Boolean}
 */
function isManned(vehicle) {
  return !!vehicle.pilots.length;
}

/**
 * @param {Array} vehicles
 * @returns {Array}
 */
const getMannedVehicles = (vehicles) => {
  return vehicles.filter((vehicle) => isManned(vehicle));
};

/**
 * @param {Array} planets
 * @param {Array} vehicles
 * @param {Array} people
 * @returns {Object}
 */
const getMaxPopulationVehicle = (planets, vehicles, people) => {
  vehicles = getMannedVehicles(vehicles);
  planets = planetService.formatPopulationToInt(planets);
  const pilots = peopleService.getVehiclePilots(people);
  const planetsHashMap = hashMap(planets, 'url');
  const pilotsHashMap = hashMap(pilots, 'url');
  let maxPopulationVehicle = {};
  let maxPopulation = 0;
  vehicles.forEach((vehicle) => {
    let vehiclePopulation = 0;
    const vehiclePilots = {};
    vehicle.pilots.forEach((pilotUrl) => {
      const { name, population } = planetsHashMap[pilotsHashMap[pilotUrl].homeworld];
      vehiclePopulation += population;
      vehiclePilots[pilotsHashMap[pilotUrl].name] = {
        homeworldName: name,
        population,
      };
      if (maxPopulation < vehiclePopulation) {
        maxPopulation = vehiclePopulation;
        maxPopulationVehicle = { ...vehicle };
        maxPopulationVehicle.pilots = vehiclePilots;
      }
    });
  });
  return maxPopulationVehicle;
};

export default {
  getVehicles,
  getMaxPopulationVehicle,
};
