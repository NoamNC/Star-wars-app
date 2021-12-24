const BASEURL = 'https://swapi.dev/api';

/**
 * gets data according to dataType
 * @param {String} dataType  represents which data do you want to receive. ie 'planets'
 * @returns {Array}  containing the data 
 */
const getDataFor = async (dataType) => {
  let data = await (await fetch(`${BASEURL}/${dataType}/`)).json();
  const results = data.results;
  let nextPageLink = data.next;
  while (nextPageLink != null) {
    data = await (await fetch(nextPageLink)).json();
    results.push(...data.results);
    nextPageLink = data.next;
  }
  return results;
};

/**
 * gets pilots from db 
 * @param {Array} pilotsUrls - array with pilots urls
 * @returns {Object} - hash map of pilots
 */
const getPilotsHashMap = async (pilotsUrls) => {
  const pilotUrlToPilotMap = {};
  for (let pilotUrl of pilotsUrls) {
    pilotUrlToPilotMap[pilotUrl] = await (await fetch(pilotUrl)).json();
  }
  return pilotUrlToPilotMap;
};

export default {
  getDataFor,
  getPilotsHashMap
};
