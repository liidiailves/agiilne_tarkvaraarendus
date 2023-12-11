const http = require('http');
var url = require('url');
 
const hostname = '127.0.0.1'; // võib kirj ka domeeninime 
const port = 3000;
const fs = require('fs');
const data2 = [];

// seerianumber
// Nimi
// 5 tk laod
// 6 ei tea
// hind ilma km
// tüüp
// hind + km

// siin loeme faili
let andmed = []
fs.readFile('LE.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const decoded = new TextDecoder('windows-1252').decode(data)
  // console.log(decoded);
  //andmed = decoded;

  // reanumbri saamiseks
  const lines = decoded.split("\n");

  let data1 = [];

  // for(let i = 0; i < lines.length; i++) {}
  for(let i = 0; i < lines.length; i++) {
    data1.push(lines[i].split("\t"));
  }

  data1.forEach((element) => {
    for(let i = 0; i < element.length; i++){
        element[i] = element[i].replaceAll('"', "");
    }

    // console.log(element[1]);

    // teeme objekti
    const part = { 
        serialNumber: element[0],
        name: element[1],
        storage1: element[2],
        storage2: element[3],
        storage3: element[4],
        storage4: element[5],
        storage5: element[6],
        unknown: element[7],
        price: element[8],
        type: element[9],
        priceWithVAT: element[10]
    };
    data2.push(part);
  });
  //console.log(data2);
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
    
  // siin filtreerime / otsime andmeid array seest
  // ja teeme koopia, mille saadame kasutajale tagasi res.end abil

  let urlQuery = req.url;
  var q = url.parse(urlQuery, true);
  var qdata = q.query;
 
  if (urlQuery == "/spare-parts"){
      res.end(JSON.stringify(data2));
  }

  else if (qdata.sn != undefined){
    res.end(JSON.stringify(searchBySerialNumber(qdata.sn, data2)));
  }

  else if (qdata.name != undefined){
    res.end(JSON.stringify(searchByName(qdata.name, data2)));
  }

  else {
    res.end("To see the list of parts, go to the link: " + hostname + ":" + port + "/spare-parts");
  }
});
 
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function searchByName(name, data){
  let result = [];
  for(let i = 0; i < data.length; i++){
    if(data[i].name.includes(name))
      result.push(data[i]);
  }
  return result;
}

function searchBySerialNumber(serialNumber, data){
  let result = [];
  for(let i = 0; i < data.length; i++){
    if(data[i].serialNumber === serialNumber)
      result.push(data[i]);
  }
  return result;
}