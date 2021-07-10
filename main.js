// Imports
const corenlp = require('corenlp');
const async = require('async');
const fs = require('fs');

// Functions
function processSentence (sentence) {
  return new Promise((resolve, reject) => {
    // resolve({rawItems:[]});
    const connector = new corenlp.ConnectorServer({ dsn: 'http://localhost:9000' });
    const props = new corenlp.Properties();
    props.setProperty('annotators', 'tokenize,ssplit,pos,lemma,ner,parse');
    const pipeline = new corenlp.Pipeline(props, 'Spanish');
    const sent = new corenlp.default.simple.Sentence(sentence);
    pipeline.annotate(sent)
    .then(sent => {
      const tree = corenlp.default.util.Tree.fromSentence(sent);
      let out = { sentence: sentence, rawItems: [] }
      tree.visitLeaves(node => {
        out.rawItems.push({
          type: node.pos(),
          value: node.word(),
        });
      });
      resolve(out)
    })
    .catch(err => {
      reject(err);
    });
  })
}
function generateTriplets (parsedSentence) {

  // START: Min triplets
  const validWords = parsedSentence.rawItems.filter(ri => (ri.type == 'PROPN' || ri.type == 'NOUN' || ri.type == 'VERB' )).map(ri => {
    if (ri.type == 'PROPN') { ri.type = 'NOUN' }
    return ri;
  });
  const nouns = validWords.filter((ri, idx) => {
    if (!idx || !validWords[idx+1]) { return }
    return (ri.type == 'NOUN' && ( validWords[idx-1].type == 'VERB' || validWords[idx+1].type == 'VERB' ))
  })
  // END: Min triplets
  
  // START: Full triplets
  // const nouns = parsedSentence.rawItems.filter(ri => (ri.type == 'PROPN' || ri.type == 'NOUN' ));
  // END: Full triplets
  
  const verbs = parsedSentence.rawItems.filter(ri => (ri.type == 'VERB'));
  let nounConbinations = [];
  nouns.forEach((ri, idx) => {
    nouns.forEach((ri2, idx2) => {
      if (!nouns[idx2+1]) { return  }
      if (ri.value == nouns[idx2+1].value) { return }
      nounConbinations.push([ri.value, nouns[idx2+1].value])
    })
  })
  let triplets = [];
  nounConbinations.forEach(nc => {
    verbs.forEach(verb => {
      triplets.push({
        nouns: nc,
        verb: verb.value
      })
    })
  })
  return triplets;
}


(async () => {
  // let parsedSentence = await processSentence('En 1532, cuando Francisco Pizarro desembarcó en Perú para conquistarlo en nombre de Dios y de la Corona española, la región ya había visto el auge y caída de varias civilizaciones.')
  // let out = generateTriplets(parsedSentence);
  // console.log(out)


  // Read file
  const dataLines = fs.readFileSync(__dirname+'/data.txt', 'utf-8').split(/[\.]/).filter(l => !!l);
  let outArrays = [];
  while (dataLines.length) {
    outArrays.push(dataLines.splice(0, 500));
  }

  let outTripletes = [];
  var procFn = (fcb, wait) => {
    let buffData = outArrays.shift();
    if (!buffData) {
      fcb();
      return;
    }
    setTimeout(() => {
      console.log('Processing..');
      let count = 1;
      async.eachSeries(buffData, (line, cb) => {
        console.log(`Pending batches ${outArrays.length} - Line ${count}/${dataLines.length}`)
        count++;
        processSentence(line).then(parsedSentence => {
          let out = generateTriplets(parsedSentence);
          outTripletes = outTripletes.concat(out);
          cb();
        }).catch(err => {
          console.log(err)
          cb();
        })
      }, (err) => {
        fs.writeFileSync(__dirname+'/out.json', JSON.stringify(outTripletes))
        procFn(fcb, true);
      })  
    }, wait ? 5000 : 0)
    
  }

  procFn(() => {
    // fs.writeFileSync(__dirname+'/out.json', JSON.stringify(outTripletes))
  })
  

})()