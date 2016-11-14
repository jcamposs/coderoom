/**
 *   Copyright (C) 2016 Jorge Campos Serrano.
 *
 *   This program is free software: you can redistribute it and/or  modify
 *   it under the terms of the GNU Affero General Public License, version 3,
 *   as published by the Free Software Foundation.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   As a special exception, the copyright holders give permission to link the
 *   code of portions of this program with the OpenSSL library under certain
 *   conditions as described in each individual source file and distribute
 *   linked combinations including the program with the OpenSSL library. You
 *   must comply with the GNU Affero General Public License in all respects
 *   for all of the code used other than as permitted herein. If you modify
 *   file(s) with this exception, you may extend this exception to your
 *   version of the file(s), but you are not obligated to do so. If you do not
 *   wish to do so, delete this exception statement from your version. If you
 *   delete this exception statement from all source files in the program,
 *   then also delete it in the license file.
 */

/**
 * Helper class for downloads using XHR/CORS. Can download any Blob-like item, whether
 * files or in-memory constructs.
 *
 * @example
 * var id = 3Gh8HSFGHSKAG;
 * var downloader = new GDriveDownloader({
 *   fileId: id,
 *   token: accessToken,
 *   onComplete: function(data) { ... }
 *   onError: function(data) { ... }
 * });
 * downloader.download();
 *
 * @constructor
 * @param {object} options Hash of options
 * @param {string} options.token Access token
 * @param {string} [options.fileId] ID of file if replacing
 * @param {function} [options.onComplete] Callback for when download is complete
 * @param {function} [options.onError] Callback if download fails
 */
GDriveDownloader = function(options) {
  var noop = function() {};
  this.token = options.token;
  this.onComplete = options.onComplete || noop;
  this.onError = options.onError || noop;

  this.url = options.url;
  if (!this.url) {
    var params = options.params || {};
    this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
  }
  this.httpMethod = 'GET';
};

/**
 * Initiate the download.
 */
GDriveDownloader.prototype.download = function() {
  var self = this;
  var xhr = new XMLHttpRequest();

  xhr.open(this.httpMethod, this.url, true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);

  xhr.onload = function(e) {
    if (e.target.status < 400) {
      this.downloadFile_(JSON.parse(xhr.responseText))
    } else {
      this.onDownloadError_(e);
    }
  }.bind(this);
  xhr.onerror = this.onDownloadError_.bind(this);

  xhr.send();
};

/**
 * Download the actual file content.
 *
 * @private
 */
GDriveDownloader.prototype.downloadFile_ = function(file) {
  if (file.downloadUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.downloadUrl, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
    xhr.onload = function() {
      var blob = xhr.response;
      blob = URL.createObjectURL(blob);
      this.onComplete(blob);
    }.bind(this);
    xhr.onerror = this.onContentDownloadError_.bind(this);
    xhr.send();
  }
};

/**
 * Handles errors for downloads. Either retries or aborts depending
 * on the error.
 *
 * @private
 * @param {object} e XHR event
 */
GDriveDownloader.prototype.onContentDownloadError_ = function(e) {
  if (e.target.status && e.target.status < 500) {
    this.onError(e.target.response);
  }
};

/**
 * Handles errors for the initial request.
 *
 * @private
 * @param {object} e XHR event
 */
GDriveDownloader.prototype.onDownloadError_ = function(e) {
  this.onError(e.target.response); // TODO - Retries for initial download
};

/**
 * Construct a query string from a hash/object
 *
 * @private
 * @param {object} [params] Key/value pairs for query string
 * @return {string} query string
 */
GDriveDownloader.prototype.buildQuery_ = function(params) {
  params = params || {};
  return Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
};

/**
 * Build the drive download URL
 *
 * @private
 * @param {string} [id] File ID if replacing
 * @param {object} [params] Query parameters
 * @return {string} URL
 */
GDriveDownloader.prototype.buildUrl_ = function(id, params, baseUrl) {
  var url = baseUrl || 'https://www.googleapis.com/drive/v2/files/';
  if (id) {
    url += id;
  }
  var query = this.buildQuery_(params);
  if (query) {
    url += '?' + query;
  }
  return url;
};
