const mongodb = require('mongodb');
const async = require('async');
const path = require('path');
const fs = require('fs');
const ObjectID = mongodb.ObjectID;

const connectToDb = (dbUrl) => {
  return new Promise ((resolve, reject) => {
    mongodb.MongoClient.connect(dbUrl, function (err, client) {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        client: client,
        db: client.db()
      });
    });
  })
}

const dburl = 'mongodb+srv://negrita:37O9xKl5KUsvqS8E@cluster0.lgozn.mongodb.net/test?retryWrites=true&w=majority';
connectToDb(dburl).then(dbData => {
  
  // Setup collection
  const stanfordDataCollection = dbData.db.collection('stanfordData');

  // Register item function
  function insertItem (data) {
    return new Promise ((resolve, reject) => {
      stanfordDataCollection.insertOne(data, (err, r) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(r.ops[0]);
      })
    })
  }

  // Load data
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'out.json'), 'utf-8'));
  
  // Upload data
  let counter = 0;
  async.eachSeries(data, (item, cb) => {
    counter++;
    insertItem(item).then(() => {
      console.log(`Item ${counter} of ${data.length}`)
      cb();
    }).catch(err => {
      console.log(err);
      cb();
    })
  }, (err) => {
    console.log('End..');
  });

})
