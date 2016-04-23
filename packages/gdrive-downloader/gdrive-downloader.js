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
    if (xhr.readyState == 4) {
      this.downloadFile_(JSON.parse(xhr.responseText))
    }
  }.bind(this);

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
    xhr.send();
  }
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