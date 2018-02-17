var changes = require('concurrent-couch-follower')
const db = 'https://replicate.npmjs.com';

var dataHandler = function(data, done) {
    console.log(data.seq)
    if(data.doc.name === 'on-npm-update') {
        console.log(data.doc.name, data.doc['dist-tags'].latest);
    }

    done();
}

var configOptions = {
    db,
    include_docs: true,
    sequence: '.sequence',
    now: true,
    concurrency: 1
}

changes(dataHandler, configOptions)