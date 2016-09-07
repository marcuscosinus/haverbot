var fs = require('fs');
var reg = /\d*.\s/;
var result = [];

fs.readFile('gamelist.txt', 'utf8', (err, data) => {
  if (err) throw err;
  //console.log(data);

  var arr = data.split("\n");

  for (a of arr) {
      result.push( a.replace(reg,'') );
  }

console.log(result);
});

