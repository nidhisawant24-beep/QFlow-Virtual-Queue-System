/**
 * Generates formatted token string like Q001, Q012, HOSP045
 * @param {string} prefix - Custom queue prefix (e.g. 'Q', 'A', 'DOC')
 * @param {number} sequenceNumber - Sequential token number
 * @returns {string} Formatted token string
 */
const formatTokenNumber = (prefix = 'Q', sequenceNumber = 1) => {
  const cleanPrefix = (prefix || 'Q').trim().toUpperCase();
  const paddedNumber = String(sequenceNumber).padStart(3, '0');
  return `${cleanPrefix}${paddedNumber}`;
};

module.exports = { formatTokenNumber };
