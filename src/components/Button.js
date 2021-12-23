// import PropTypes from 'prop-types';

const Button = ({ color, text }) => {
  const BASEURL = 'https://swapi.dev/api';

  /**
   *
   * @param {String} link - a initail link to get data from
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

  const getPlanetsData = async () => {
    const planetsObj = {};
    let planetsArr = [];
    const initialPlanetsData = await (
      await fetch(`${BASEURL}/planets/`)
    ).json();
    const pages = Math.ceil(
      initialPlanetsData.count / initialPlanetsData.results.length
    );
    planetsArr.push(...initialPlanetsData.results);
    planetsArr.push(
      ...(await getDataFromAllPages(initialPlanetsData.next, pages))
    );

    for (let planet of planetsArr) {
      planetsObj[`${planet.url}`] = {
        homeworld: planet.name,
        population:
          planet.population === 'unknown' ? 0 : parseInt(planet.population),
      };
    }
    return planetsObj;
  };

  const getPeopleData = async (planetsObj) => {
    const peopleArr = [];
    const peopleObj = {};
    const initialPeopleData = await (await fetch(`${BASEURL}/people/`)).json();
    const pages = Math.ceil(
      initialPeopleData.count / initialPeopleData.results.length
    );
    peopleArr.push(...initialPeopleData.results);
    peopleArr.push(
      ...(await getDataFromAllPages(initialPeopleData.next, pages))
    );
    for (let pilot of peopleArr) {
      peopleObj[`${pilot.url}`] = {
        name: pilot.name,
        homeworld: planetsObj[`${pilot.homeworld}`],
      };
    }
    return peopleObj;
  };
  const getVehiclesData = async (peopleObj) => {
    let largestPopulation = 0;
    let currVehicle = {};
    const vehiclesArr = [];
    const vehiclesObj = {};
    const initialVehiclesData = await (
      await fetch(`${BASEURL}/starships/`)
    ).json();
    const pages = Math.ceil(
      initialVehiclesData.count / initialVehiclesData.results.length
    );
    vehiclesArr.push(...initialVehiclesData.results);
    vehiclesArr.push(
      ...(await getDataFromAllPages(initialVehiclesData.next, pages))
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

  const getData = async () => {
    const planetsObj = await getPlanetsData();
    const peopleObj = await getPeopleData(planetsObj);
    const currVehicle = await getVehiclesData(peopleObj);
    console.log(currVehicle);
  };

  return (
    <button
      onClick={getData}
      style={{ backgroundColor: color }}
      className='btn'
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  color: 'red',
};

// Button.prototype = {
//     color: PropTypes.string,
//     text: PropTypes.string,
//     onClick: PropTypes.func.isRequired
// }
export default Button;
