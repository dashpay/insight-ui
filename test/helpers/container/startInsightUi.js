'use strict';
/* jshint ignore:start */
const createInsightUI = require('./createInsightUI');

/**
 * Start and stop Insight instance for mocha tests
 *
 * @param {object} [options]
 * @return {Promise<InsightUI>}
 */
async function startInsightUi(options) {
  const instances = await startInsightUi.many(1, options);

  return instances[0];
}

/**
 * Start and stop a specific number of Insight UI instances for mocha tests
 *
 * @param {number} number
 * @param {object} [options]
 * @return {Promise<InsightUI[]>}
 */
startInsightUi.many = async function many(number, options) {
  if (number < 1) {
    throw new Error('Invalid number of instances');
  }

  const instances = [];

  for (let i = 0; i < number; i++) {
    const instance = await createInsightUI(options);
    await instance.start();
    instances.push(instance);
  }

  return instances;
};

module.exports = startInsightUi;
