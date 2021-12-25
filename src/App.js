import { useState, useEffect } from 'react';
import apiService from './services/api-service';
import LoadingScreen from './components/ux/LoadingScreen';
import PlanetPopulationChart from './components/PlanetPopulationChart';
import VehicleWithMaxPopulationTable from './components/VehicleWithMaxPopulationTable';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState();
  const [pilots, setPilots] = useState();
  const [planets, setPlanets] = useState();
  const [chartPlanets, setChartPlanets] = useState();
  const [width, setWindowWidth] = useState(0);

  /**
   * updates width param needed for dynamic styling.
   */
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

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
    }
    // Does a sorted chart look better??
    //
    // chartPlanets.sort((firstPlanet, secondPlanet) => {
    //   return firstPlanet.population - secondPlanet.population;
    // });

    setChartPlanets(chartPlanets);
    return planetUrlToPlanetMap;
  };

  useEffect(async () => {
    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    const vehicles = await apiService.getDataFor('vehicles');
    const pilotsUrls = [];
    for (let vehicle of vehicles) {
      for (let pilotUrl of vehicle.pilots) {
        pilotsUrls.push(pilotUrl);
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

  window.removeEventListener('resize', updateDimensions);

  return (
    <>
      <div
        style={
          isLoading
            ? { display: 'none' }
            : {
                display: 'block',
                padding: `${Math.ceil(width / 400)}%  ${Math.ceil(
                  width / 60
                )}%`,
              }
        }
      >
        <VehicleWithMaxPopulationTable
          vehicle={vehicle}
          planets={planets}
          pilots={pilots}
        />
        <PlanetPopulationChart chartPlanets={chartPlanets} width={width} />
      </div>
      <div style={isLoading ? { display: 'block' } : { display: 'none' }}>
        <LoadingScreen />
      </div>
    </>
  );
}

export default App;
