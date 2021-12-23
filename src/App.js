import { useState, useEffect } from 'react';
import apiService from './services/api-service';
import Button from './components/Button';

function App() {
  /**
   * gets all planets and saves only required data in hashmap.
   * in addition, adds selected planets to the store.
   * @returns {Object} - planetsHashMap, contains planet name and planet population of all the planets
   */
  const getAllPlanetsAndInitializePlanetChart = async () => {
    const planetsForChart = [];
    const selectedPlanets = {
      Tatooine: true,
      Alderaan: true,
      Naboo: true,
      Bespin: true,
      Endor: true,
    };
    const allPlanets = [];
    const planetsHashMap = {};
    const initialPlanetsData = await apiService.getInitialDataFor('planets');
    allPlanets.push(...initialPlanetsData.results);
    allPlanets.push(
      ...(await apiService.getDataFromAllPages(
        initialPlanetsData.initialPage,
        initialPlanetsData.totalNumOfPages
      ))
    );
    for (let planet of allPlanets) {
      const planetObj = {
        name: planet.name,
        population:
          planet.population === 'unknown' ? 0 : parseInt(planet.population),
      };
      planetsHashMap[planet.url] = planetObj;
      if (selectedPlanets[`${planet.name}`]) {
        planetsForChart.push(planetObj);
      }
    }
    setPlanets(planetsForChart);
    return planetsHashMap;
  };

  /**
   * gets all vehicles and saves only required data in hashMap.
   * @returns {Object} - contains vehicles hashMap and an Array of pilot urls
   */
  const getVehiclesAndPilotsUrl = async () => {
    const vehiclesArr = [];
    const pilotsUrl = [];
    const checkForCopiesHashMap = {};
    const vehiclesHashMap = {};
    const initialVehiclesData = await apiService.getInitialDataFor('vehicles');
    vehiclesArr.push(...initialVehiclesData.results);
    vehiclesArr.push(
      ...(await apiService.getDataFromAllPages(
        initialVehiclesData.initialPage,
        initialVehiclesData.totalNumOfPages
      ))
    );
    for (let vehicle of vehiclesArr) {
      if (vehicle.pilots.length > 0) {
        vehiclesHashMap[vehicle.url] = {
          name: vehicle.name,
          pilots: {},
          populationSumOfAllPilots: 0,
          url: vehicle.url,
        };
        vehicle.pilots.forEach((pilotURL) => {
          vehiclesHashMap[vehicle.url].pilots[pilotURL] = pilotURL;
          if (checkForCopiesHashMap[pilotURL]) {
            console.log('pilot already exist');
          } else {
            pilotsUrl.push(pilotURL);
            checkForCopiesHashMap[pilotURL] = pilotURL;
          }
        });
      }
    }
    return {
      pilotsUrl,
      vehicles: vehiclesHashMap,
    };
  };

  const [vehicle, setVehicle] = useState();
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * gets all vehicles and their pilots,
     * gets all pilots and their home planets,
     * gets all planets and initializes planet chart,
     * inserts planets in pilots and pilots in vehicles
     * finds the vehicle with the largest sum of all pilots home planets population and sets store
     * disables the loader
     */
    const initializeApp = async () => {
      const { vehicles, pilotsUrl } = await getVehiclesAndPilotsUrl();
      const pilots = await apiService.getPilotsAndTheirHomeWorldsUrl(pilotsUrl);
      const planets = await getAllPlanetsAndInitializePlanetChart();
      let selectedVehicle = {};

      for (let vehicle of Object.values(vehicles)) {
        let populationSumOfAllPilots = 0;
        let maxPopulationSumOfAllPilots = 0;
        for (let pilotURL in vehicle.pilots) {
          const pilot = { ...pilots[pilotURL] };
          pilot.homeWorld = planets[pilot.homeWorld];
          populationSumOfAllPilots = +pilot.homeWorld.population;
          vehicles[vehicle.url].pilots[pilotURL] = pilot;
        }
        vehicles[vehicle.url].populationSumOfAllPilots =
          populationSumOfAllPilots;
        if (populationSumOfAllPilots > maxPopulationSumOfAllPilots) {
          maxPopulationSumOfAllPilots = populationSumOfAllPilots;
          selectedVehicle = vehicles[vehicle.url];
        }
      }

      console.log(vehicles);
      console.log(selectedVehicle);
      setVehicle(selectedVehicle);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  return (
    <div>
      <div
        className='container'
        style={isLoading ? { display: 'none' } : { display: 'block' }}
      >
        {/* <Button /> */}
        <table>
          <tbody>
            <tr className='flexup'>
              <td className='box'>Vehicle name with the largest sum</td>
              <td className='box'>{vehicle ? vehicle.name : ''}</td>
            </tr>
            <tr className='flexup'>
              <td className='box'>
                Related home planets and their respective population
              </td>
              <td className='box'>
                {vehicle
                  ? Object.values(vehicle.pilots).map((pilot) => [
                      pilot.homeWorld.name + ', ',
                      pilot.homeWorld.population,
                    ])
                  : ''}
              </td>
            </tr>
            <tr className='flexup'>
              <td className='box'>Related pilot names</td>
              <td className='box'>
                {vehicle
                  ? Object.values(vehicle.pilots).map((pilot) => pilot.name)
                  : ''}
              </td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
        <div className='chart'>
          {planets.map((planet) => (
            <div key={planet.name}>
              <span>{planet.population}</span>
              <div
                className='bar'
                style={{
                  height: `${Math.ceil(planet.population / 20000000)}px`,
                }}
              ></div>
              <span>{planet.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        className='pageLoading'
        style={isLoading ? { display: 'flex' } : { display: 'none' }}
      >
        <div className='loader'>Loading...</div>
      </div>
    </div>
  );
}

export default App;
