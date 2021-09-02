/**
 * Returns a new object by merging oldObject and newObject
 * @param {Object} oldObject
 * @param {Object} newObject
 * @returns {Object}
 */
export const mergeObjects = (oldObject, newObject) => {
  return {
    ...oldObject,
    ...newObject,
  };
};
