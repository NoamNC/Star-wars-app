
const BASEURL = 'https://swapi.dev/api';

/**
 * @param {String} resource  represents collection desired
 * @returns {Array}
 */
const getAllDataFromCollection = async (resource) => {
  const data = await (await fetch(`${BASEURL}/${resource}/`)).json();
  let results = data.results;
  const numOfPages = Math.ceil(data.count / data.results.length);
  const requests = [];
  for (let page = 2; page <= numOfPages; page++) {
    requests.push(fetch(`${BASEURL}/${resource}/?page=${page}`));
  }
  const responses = await Promise.all(requests);
  const promiseResults = await Promise.all(
    responses.map((response) => response.json())
  );
  promiseResults.forEach((promiseResult) =>
    results.push(...promiseResult.results)
  );
  return results
};



export default {
  getAllDataFromCollection
};
