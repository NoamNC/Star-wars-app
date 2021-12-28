
/**
 * @param {Array} arr 
 * @param {String} property 
 * @returns {Object}
 */
export function hashMap(arr, property){
    const hashMap = {};
    arr.forEach(item => {
        hashMap[item[property]] = item;
    });
    return hashMap;
}