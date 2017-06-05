'use strict'

/**
 * @module serverless-plugin-jsonenv
 *
 * @see {@link https://serverless.com/framework/docs/providers/aws/guide/plugins/}
 *
 * @requires 'bluebird'
 * */
const BbPromise = require('bluebird')

/**
 * @classdesc Merge JSON with environment objects
 * @class JSONEnv
 * */
class JSONEnv {
  /**
   * @description Serverless JSON Environment
   * @constructor
   *
   * @param {!Object} serverless - Serverless object
   * */
  constructor (serverless) {
    /** Serverless variables */
    this.serverless = serverless

    /** AWS provider check */
    if (this.serverless.service.provider.name === 'aws') {
      /** Serverless hooks */
      this.hooks = {
        'after:package:initialize': this.mergeEnvironments.bind(this),
        'before:invoke:local:invoke': this.mergeEnvironments.bind(this),
        'before:package:function:package': this.mergeEnvironments.bind(this),
        'offline:start:init': this.mergeEnvironments.bind(this)
      }
    }
  }

  /**
   * @description Merge Environments
   *
   * @fulfil {} — Merge JSON variables
   * @reject {Error} Merge error
   *
   * @return {Promise}
   * */
  mergeEnvironments () {
    /** Provider JSON environment variables exist */
    if (this.serverless.service.provider.environmentJSON) {
      /** Initialize environment object */
      this.serverless.service.provider.environment = this.serverless.service.provider.environment || {}

      /** Merge provider JSON environment variables */
      this.merge(
        this.serverless.service.provider.environment,
        this.serverless.service.provider.environmentJSON
      )
    }

    /** Get functions */
    const allFunctions = this.serverless.service.getAllFunctions()

    /** Merge functions JSON environment variables */
    return BbPromise.map(allFunctions, (functionName) => {
      const functionObject = this.serverless.service.getFunction(functionName)

      /** Function JSON environment variables exist */
      if (functionObject.environmentJSON) {
        /** Initialize environment object */
        functionObject.environment = functionObject.environment || {}
        this.merge(
          functionObject.environment,
          functionObject.environmentJSON
        )
      }
      return functionObject
    })
  }

  /**
   * @description Merge Environment Objects
   *
   * @param {!*} environment - Source environment
   * @param {!*} environmentJSON - Environment
   *
   * @return {*} Merged environment
   * */
  merge (environment, environmentJSON) {
    if (environmentJSON && (typeof environment !== 'object' || environment === null)) {
      throw new this.serverless.classes.Error('JSON Environment: environment must be an object');
    }

    try {
      Object.assign(environment, JSON.parse(environmentJSON))
    } catch (error) {
      throw new this.serverless.classes.Error('JSON Environment: JSON string is not valid');
    }

    return environment
  }
}

/** Export JSONEnv class */
module.exports = JSONEnv
