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

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${month}/${day}/${year}`;
};

export const validateFloat = (maxDecimal, maxFloat) => (value) => {
  let result;
  if (!isNaN(value)) {
    const numArr = (value + "").split(".");
    if (value % 1 > 0) {
      result = numArr[0].length <= maxDecimal && numArr[1].length <= maxFloat;
    } else {
      result = numArr[0].length <= maxDecimal;
    }
  }
  return result ? undefined : "Invalid value";
};

export const validateLimit = (min, max) => (value) => {
  let result;
  if (!isNaN(value)) {
    result = value >= min && value <= max;
  }
  return result ? undefined : "Invalid value";
};
