const BASEURL = 'https://swapi.dev/api';

/**
 * gets initial data according to dataType
 * @param {String} dataType - represents which data do you want to receive. ie 'plants'
 * @returns {Object} - containing the data required to initialize
 */
const getInitialDataFor = async (dataType) => {
  const initialData = await (await fetch(`${BASEURL}/${dataType}/`)).json();
  return {
    initialPage: initialData.next,
    totalNumOfPages: Math.ceil(initialData.count / initialData.results.length),
    results: initialData.results,
  };
};

/**
 *
 * @param {String} link - a initial link to get data from
 * @param {Number} pages - the amount of pages to get data from
 * @returns {Array} - all the data collected
 */
const getDataFromAllPages = async (link, totalNumOfPages) => {
  const dataArr = [];
  for (let page = 1; page < totalNumOfPages; page++) {
    const data = await (await fetch(link)).json();
    link = data.next;
    dataArr.push(...data.results);
  }
  return dataArr;
};

/**
 * 
 * @param {Array} pilotsUrl 
 * @returns 
 */
const getPilotsAndTheirHomeWorldsUrl = async (pilotsUrl) => {
  const pilotsObj = {};
  for (let pilotIndex = 0; pilotIndex < pilotsUrl.length; pilotIndex++) {
    const pilot = await (await fetch(pilotsUrl[pilotIndex])).json();
    pilotsObj[pilot.url] = {
      name: pilot.name,
      homeWorld: '',
    };
    pilotsObj[pilot.url].homeWorld = pilot.homeworld;
  }
  return pilotsObj;
};


export default {
  getDataFromAllPages,
  getInitialDataFor,
  getPilotsAndTheirHomeWorldsUrl,
};
