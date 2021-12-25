const BASEURL = 'https://swapi.dev/api';

/**
 * gets data according to dataType
 * @param {String} dataType  represents which data do you want to receive.
 * @returns {Array}  containing the data
 */
const getDataFor = async (dataType) => {
  const data = await (await fetch(`${BASEURL}/${dataType}/`)).json();
  let results = data.results;
  const numOfPages = Math.ceil(data.count / data.results.length);
  const requests = [];
  for (let page = 2; page <= numOfPages; page++) {
    requests.push(fetch(`${BASEURL}/${dataType}/?page=${page}`));
  }
  const responses = await Promise.all(
    requests.map((request) => Promise.resolve(request))
  );
  const promiseResults = await Promise.all(
    responses.map((response) => Promise.resolve(response.json()))
  );
  for (let res of promiseResults) {
    results = results.concat(res.results);
  }
  // check whats best (!)
  //
  // let nextPageLink = data.next;
  // while (nextPageLink != null) {
  //   data = await (await fetch(nextPageLink)).json();
  //   results.push(...data.results);
  //   nextPageLink = data.next;
  // }
  return results;
};

/**
 * gets pilots from db
 * @param {Array} pilotsUrls - array with pilots urls
 * @returns {Object} - hash map of pilots
 */
const getPilotsHashMap = async (pilotsUrls) => {
  const pilotUrlToPilotMap = {};
  const responses = await Promise.all(
    pilotsUrls.map((pilotUrl) => Promise.resolve(fetch(pilotUrl)))
  );
  const pilots = await Promise.all(
    responses.map((response) => Promise.resolve(response.json()))
  );
  for (let pilot of pilots) {
    pilotUrlToPilotMap[pilot.url] = pilot;
  }
  // check whats best (!)
  //
  // for (let pilotUrl of pilotsUrls) {
  //   pilotUrlToPilotMap[pilotUrl] = await (await fetch(pilotUrl)).json();
  // }
  return pilotUrlToPilotMap;
};

export default {
  getDataFor,
  getPilotsHashMap,
};
