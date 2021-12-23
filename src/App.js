import { useState, useEffect } from 'react';
import Button from './components/Button';
function App() {
  const BASEURL = 'https://swapi.dev/api';

  /**
   * gets initial data according to dataType
   * @param {String} dataType - represents which data do you want to receive. ie 'plants'
   * @returns {Object} - containing the data required to initialize 
   */
  const getInitialData = async (dataType) => {
    const initialData = await (await fetch(`${BASEURL}/${dataType}/`)).json();
    const pages = Math.ceil(initialData.count / initialData.results.length);
    return {
      initialPage: initialData.next,
      pages,
      results: initialData.results,
    };
  };

  /**
   * 
   * @param {String} link - a initial link to get data from
   * @param {Number} pages - the amount of pages to get data from
   * @returns {Array} - all the data collected
   */
  const getDataFromAllPages = async (link, pages) => {
    const dataArr = [];
    for (let page = 1; page < pages; page++) {
      const data = await (await fetch(link)).json();
      link = data.next;
      dataArr.push(...data.results);
    }
    return dataArr;
  };

  /**
   * takes all data regarding all planets and extracts name and population.
   * in addition it adds selected planets to the store.
   * @returns {Object} - contains planet name and planet population of all the planets
   */
  const getPlanets = async () => {
    const planetsObj = {};
    const planetsForChartArr = [];
    const selectedPlanets = {
      Tatooine: true,
      Alderaan: true,
      Naboo: true,
      Bespin: true,
      Endor: true,
    };
    const planetsArr = [];
    const initialPlanetsData = await getInitialData('planets');
    planetsArr.push(...initialPlanetsData.results);
    planetsArr.push(
      ...(await getDataFromAllPages(
        initialPlanetsData.initialPage,
        initialPlanetsData.pages
      ))
    );

    for (let planet of planetsArr) {
      planetsObj[`${planet.url}`] = {
        homeworld: planet.name,
        population:
          planet.population === 'unknown' ? 0 : parseInt(planet.population),
      };
      if (selectedPlanets[`${planet.name}`]) {
        planetsForChartArr.push({
          name: planet.name,
          population:
            planet.population === 'unknown' ? 0 : parseInt(planet.population),
        });
      }
    }

    setPlanets(planetsForChartArr);
    return planetsObj;
  };


  const getPeople = async (planetsObj) => {
    const peopleArr = [];
    const peopleObj = {};
    const initialPeopleData = await getInitialData('people');
    peopleArr.push(...initialPeopleData.results);
    peopleArr.push(
      ...(await getDataFromAllPages(
        initialPeopleData.initialPage,
        initialPeopleData.pages
      ))
    );
    for (let pilot of peopleArr) {
      peopleObj[`${pilot.url}`] = {
        name: pilot.name + ' ',
        homeworld: planetsObj[`${pilot.homeworld}`],
      };
    }

    return peopleObj;
  };
  const getVehicles = async (peopleObj) => {
    let largestPopulation = 0;
    let currVehicle = {};
    const vehiclesArr = [];
    const vehiclesObj = {};
    const initialVehiclesData = await getInitialData('starships');
    vehiclesArr.push(...initialVehiclesData.results);
    vehiclesArr.push(
      ...(await getDataFromAllPages(
        initialVehiclesData.initialPage,
        initialVehiclesData.pages
      ))
    );
    for (let vehicle of vehiclesArr) {
      if (vehicle.pilots.length > 0) {
        vehiclesObj[`${vehicle.name}`] = {
          pilots: vehicle.pilots.reduce((arr, val) => {
            arr[`${peopleObj[val].name}`] = peopleObj[val].homeworld;
            return arr;
          }, {}),
        };
        vehiclesObj[`${vehicle.name}`].populationSumOfAllPilots = Object.keys(
          vehiclesObj[`${vehicle.name}`].pilots
        ).reduce((previous, key) => {
          return (
            previous + vehiclesObj[`${vehicle.name}`].pilots[key].population
          );
        }, 0);

        if (
          vehiclesObj[`${vehicle.name}`].populationSumOfAllPilots >
          largestPopulation
        ) {
          largestPopulation =
            vehiclesObj[`${vehicle.name}`].populationSumOfAllPilots;
          currVehicle = vehiclesObj[`${vehicle.name}`];
          currVehicle.name = vehicle.name;
        }
      }
    }

    return currVehicle;
  };
  const getVehicles2 = async (peopleObj) => {
    let currVehicle = {};
    const vehiclesArr = [];
    const pilotsUrl = []
    const initialVehiclesData = await getInitialData('starships');
    vehiclesArr.push(...initialVehiclesData.results);
    vehiclesArr.push(
      ...(await getDataFromAllPages(
        initialVehiclesData.initialPage,
        initialVehiclesData.pages
      ))
    );
    for (let vehicle of vehiclesArr) {
      for(let pilot in vehicle.pilots){
        pilotsUrl.push(pilot.url)
      }
    }

    return currVehicle;
  };

  const [vehicle, setVehicle] = useState();
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDate = async () => {
      const planetsObj = await getPlanets();
      const peopleObj = await getPeople(planetsObj);
      const currVehicle = await getVehicles(peopleObj);
      setVehicle(currVehicle);
      setIsLoading(false);
    };

    fetchDate();
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
                {vehicle ? JSON.stringify(Object.values(vehicle.pilots)) : ''}
              </td>
            </tr>
            <tr className='flexup'>
              <td className='box'>Related pilot names</td>
              <td className='box'>
                {vehicle ? Object.keys(vehicle.pilots) : ''}
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
                  height: `${Math.ceil(planet.population / 10000000)}px`,
                }}
              ></div>
              <span>{planet.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='pageLoading' style={isLoading ? { display: 'flex' } : { display: 'none' }}>
        <div className='loader'>Loading...</div>
      </div>
    </div>
  );
}

export default App;
