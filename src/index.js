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
    /** Merge all environment JSON */
    this.mergeAllJSON(this.serverless.service.provider)

    /** Get functions */
    const allFunctions = this.serverless.service.getAllFunctions()

    /** Merge functions JSON environment variables */
    return BbPromise.map(allFunctions, (functionName) => {
      const functionObject = this.serverless.service.getFunction(functionName)

      /** Merge all environment JSON */
      this.mergeAllJSON(functionObject)

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
      throw new this.serverless.classes.Error('JSON Environment: environment must be an object')
    }

    try {
      Object.assign(environment, JSON.parse(environmentJSON))
    } catch (error) {
      throw new this.serverless.classes.Error('JSON Environment: JSON string is not valid')
    }

    return environment
  }

  /**
   * @description Merge All JSON Environment
   *
   * @param {!Object} provider - Serverless Provider
   *
   * @return {*} Merged environment
   * */
  mergeAllJSON (provider) {
    /** Loop through provider keys */
    const keys = Object.keys(provider)
    keys.forEach((key) => {
      /** Merge provider JSON environment variables */
      if (key.indexOf('environmentJSON') !== -1) {
        /** Initialize environment object */
        provider.environment = provider.environment || {}

        this.merge(
          provider.environment,
          provider[key]
        )
      }
    })

    return provider.environment
  }
}

/** Export JSONEnv class */
module.exports = JSONEnv
