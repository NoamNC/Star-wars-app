import apiService from './api-service';
import planetService from './planet-service';
import peopleService from './people-service';
import { hashMap } from '../utils/hash-map';

/**
 * @returns {Array}
 */
const getVehicles = async () => {
  return await apiService.getAllDataFromCollection('vehicles');
};

/**
 * @param {Array} vehicles 
 * @returns {Array}
 */
const getMannedVehicles = (vehicles) => {
  return vehicles.filter((vehicle) => {
    if (!!vehicle.pilots.length) {
      return vehicle;
    }
  });
};


/**
 * @param {Array} planets 
 * @param {Array} vehicles 
 * @param {Array} people 
 * @returns {Object}
 */
const getVehicleForChart = (planets, vehicles, people) => {
  vehicles = getMannedVehicles(vehicles);
  planets = planetService.changePopulationToInt(planets);
  const planetsHashMap = hashMap(planets, 'url');
  const pilots = peopleService.getVehiclePilots(people);
  const pilotsHashMap = hashMap(pilots, 'url');
  let maxPopulationVehicle = {};
  let maxPopulation = 0;
  vehicles.forEach((vehicle) => {
    let vehiclePopulation = 0;
    const vehiclePilots = {};
    vehicle.pilots.forEach((pilotUrl) => {
        vehiclePopulation +=
        planetsHashMap[pilotsHashMap[pilotUrl].homeworld].population;
      vehiclePilots[pilotsHashMap[pilotUrl].name] = {
        homeworldName: planetsHashMap[pilotsHashMap[pilotUrl].homeworld].name,
        population:
          planetsHashMap[pilotsHashMap[pilotUrl].homeworld].population,
      };
      if (maxPopulation < vehiclePopulation) {
        maxPopulation = vehiclePopulation;
        maxPopulationVehicle = {...vehicle};
        maxPopulationVehicle.pilots = vehiclePilots;
      }
    });
  });
  return maxPopulationVehicle;
};

export default {
  getVehicles,
  getVehicleForChart,
};
