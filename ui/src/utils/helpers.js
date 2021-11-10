/*
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

/*
 * Returns a new date by converting date of timezone format into DD/MM/YYYY format
 * @param {Date} date
 * @returns {String}
 */
export const formattedDate = (date) => {
  let d = new Date(date);
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}/${month}/${year}`;
};
