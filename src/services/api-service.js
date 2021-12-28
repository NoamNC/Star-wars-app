const BASEURL = 'https://swapi.dev/api';

/**
 * @param {String} resource
 * @returns {Object}
 */
const getFirstPage = async (resource) => {
  try {
    return await (await fetch(`${BASEURL}/${resource}/?page=1`)).json();
  } catch (err) {
    console.log(err);
    throw `fetch from server Failed. check if *${resource}* exist in the API's collections`;
  }
};

/**
 * @param {String} resource
 * @returns {Array}
 */
const getAll = async (resource) => {
  const data = await getFirstPage(resource);
  const { results, count } = data;
  const numOfPages = Math.ceil(count / results.length);
  const requests = [];
  for (let page = 2; page <= numOfPages; page++) {
    requests.push(fetch(`${BASEURL}/${resource}/?page=${page}`));
  }
  const responses = await Promise.all(requests);
  const promiseResults = await Promise.all(responses.map((response) => response.json()));
  promiseResults.forEach((promiseResult) => results.push(...promiseResult.results));
  return results;
};

export default {
  getAll,
};
