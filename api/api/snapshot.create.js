/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildSnapshotCreate (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts
  /**
   * Perform a [snapshot.create](https://www.elastic.co/guide/en/elasticsearch/reference/5.x/modules-snapshots.html) request
   *
   * @param {string} repository - A repository name
   * @param {string} snapshot - A snapshot name
   * @param {time} master_timeout - Explicit operation timeout for connection to master node
   * @param {boolean} wait_for_completion - Should this request wait until the operation has completed before returning
   * @param {object} body - The snapshot definition
   */

  const acceptedQuerystring = [
    'master_timeout',
    'wait_for_completion',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    masterTimeout: 'master_timeout',
    waitForCompletion: 'wait_for_completion',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  return function snapshotCreate (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (typeof params === 'function' || params == null) {
      callback = params
      params = {}
      options = {}
    }

    // check required parameters
    if (params['repository'] == null) {
      const err = new ConfigurationError('Missing required parameter: repository')
      return handleError(err, callback)
    }
    if (params['snapshot'] == null) {
      const err = new ConfigurationError('Missing required parameter: snapshot')
      return handleError(err, callback)
    }

    // check required url components
    if (params['snapshot'] != null && (params['repository'] == null)) {
      const err = new ConfigurationError('Missing required parameter of the url: repository')
      return handleError(err, callback)
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      const err = new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`)
      return handleError(err, callback)
    }

    var warnings = []
    var { method, body, repository, snapshot, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    if (method == null) {
      method = 'PUT'
    }

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

    // build request object
    const request = {
      method,
      path,
      body: body || '',
      querystring
    }

    options.warnings = warnings.length === 0 ? null : warnings
    return makeRequest(request, options, callback)
  }
}

module.exports = buildSnapshotCreate