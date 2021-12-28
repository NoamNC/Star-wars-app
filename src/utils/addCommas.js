
/**
 * @param {String} str 
 * @returns {String} 
 */
 export function addCommas(str){
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}