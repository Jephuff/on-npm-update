const changes = require('concurrent-couch-follower');
const latestVersion = require('latest-version');
const minimist = require('minimist');
const childProcess = require('child_process');

var { p: packageName, command } = minimist(process.argv.slice(2), {
  string: ['package-name', 'command'],
  alias: { p: 'package-name', c: 'command' },
});

if (!packageName) {
  console.log('must provide a package name');
  process.exit(1);
}

if (!command) {
  console.log('must provide a command');
  process.exit(1);
}

console.log('listening for changes of the ' + packageName);
console.log('running "' + command + '" on change');

const db = 'https://replicate.npmjs.com';

const configOptions = {
  db,
  include_docs: true,
  sequence: '.sequence',
  now: true,
  concurrency: 1,
};

latestVersion(packageName).then(function(version) {
  const currentVersion = version;

  function onChange(data, done) {
    if (data.doc.name === packageName) {
      const latest = data.doc['dist-tags'].latest;

      console.log(
        packageName,
        'updated. current version',
        currentVersion,
        'latest version',
        latest,
      );
      if (latest !== currentVersion) {
        currentVersion = latest;
        childProcess.exec(command, function(err, output) {
          console.log(output);
          if (err) console.error(err);
          done();
        });
      }
    }

    done();
  }

  changes(onChange, configOptions);
});
