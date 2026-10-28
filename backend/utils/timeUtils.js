/**
 * Calculate estimated wait time in minutes
 * @param {number} peopleAhead - Number of customers ahead in queue
 * @param {number} avgTimePerPerson - Average service time in minutes
 * @returns {number} Estimated minutes
 */
const calculateWaitTime = (peopleAhead, avgTimePerPerson = 10) => {
  if (peopleAhead <= 0) return 2; // ready soon / next up
  return Math.round(peopleAhead * avgTimePerPerson);
};

module.exports = { calculateWaitTime };
