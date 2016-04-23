Package.describe({
  name: 'jcamposs:gdrive-downloader',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Meteor package that installs the Google Drive driver for download files directly with XHR/CORS',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('gdrive-downloader.js', 'client');

  if (api.export)
    api.export('GDriveDownloader');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jcamposs:gdrive-downloader');
  api.addFiles('gdrive-downloader-tests.js');
});
