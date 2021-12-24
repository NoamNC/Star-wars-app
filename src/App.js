import { useState, useEffect } from 'react';
import apiService from './services/api-service';
import Loader from './components/ux/Loader';
import PlanetPopulationChart from './components/PlanetPopulationChart';
import VehicleWithMaxPopulationTable from './components/VehicleWithMaxPopulationTable';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState();
  const [pilots, setPilots] = useState();
  const [planets, setPlanets] = useState();
  const [chartPlanets, setChartPlanets] = useState();

  /**
   * gets all planets and saves in hashmap.
   * + changes the population attribute to 0 if string cant be represented by number , otherwise converts to number.
   * in addition, adds planets For Chart to the store.
   * @param {Object} planetsForChart - hashmap with the names of the planets needed for the chart
   * @returns {Object} - planetsHashMap
   */
  const getPlanetsHashMapAndInitializePlanetChart = async (planetsForChart) => {
    const chartPlanets = [];
    const planetUrlToPlanetMap = {};
    const planets = await apiService.getDataFor('planets');
    for (let planet of planets) {
      planet.population =
        planet.population === 'unknown' ? 0 : parseInt(planet.population);

      planetUrlToPlanetMap[planet.url] = planet;
      if (planetsForChart.has(planet.name)) {
        chartPlanets.push(planet);
      }
      chartPlanets.sort((firstPlant, secondPlanet) => {
        return firstPlant.population - secondPlanet.population;
      });
    }
    setChartPlanets(chartPlanets);
    return planetUrlToPlanetMap;
  };

  useEffect(async () => {
    const vehicles = await apiService.getDataFor('vehicles');
    const pilotsUrls = new Set();
    for (let vehicle of vehicles) {
      for (let pilotUrl of vehicle.pilots) {
        pilotsUrls.add(pilotUrl);
      }
    }
    const pilots = await apiService.getPilotsHashMap(pilotsUrls);
    const planetsForChart = new Set([
      'Tatooine',
      'Alderaan',
      'Naboo',
      'Bespin',
      'Endor',
    ]);
    const planets = await getPlanetsHashMapAndInitializePlanetChart(
      planetsForChart
    );

    const maxPopulationVehicle = {
      vehicle: null,
      population: 0,
    };
    for (let vehicle of Object.values(vehicles)) {
      let vehiclePopulation = 0;
      for (let pilotURL of vehicle.pilots) {
        vehiclePopulation += planets[pilots[pilotURL].homeworld].population;
      }

      if (maxPopulationVehicle.population < vehiclePopulation) {
        maxPopulationVehicle.vehicle = vehicle;
        maxPopulationVehicle.population = vehiclePopulation;
      }
    }

    const vehiclePilots = maxPopulationVehicle.vehicle.pilots.map(
      (pilot) => pilots[pilot]
    );
    const VehiclePilotsHomePlanets = vehiclePilots.map(
      (pilot) => planets[pilot.homeworld]
    );
    setVehicle(maxPopulationVehicle.vehicle);
    setPilots(vehiclePilots);
    setPlanets(VehiclePilotsHomePlanets);
    setIsLoading(false);
  }, []);

  return (
    <>
      <div
        className='container'
        style={isLoading ? { display: 'none' } : { display: 'block' }}
      >
        <VehicleWithMaxPopulationTable
          vehicle={vehicle}
          planets={planets}
          pilots={pilots}
        />
        <PlanetPopulationChart chartPlanets={chartPlanets} />
      </div>

      <div
        className='pageLoading'
        style={isLoading ? { display: 'flex' } : { display: 'none' }}
      >
        <Loader />
      </div>
    </>
  );
}

export default App;
