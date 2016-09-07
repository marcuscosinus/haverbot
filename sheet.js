var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('11JoIst3gOU6LEcGsAnnXxMIRzXgYAm6bpqTx6Cz2mns');
var sheet;
var havers = [];

async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('./havermarcus-84fbd647383f.json');
    // OR, if you cannot save the file locally (like on heroku)
    var creds_json = {
      client_email: 'havermarcus-141313@appspot.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUyCjrobRQsXfQ\nfj+mdTTnuhR18+djhUW8yn/RKnvzgUZ6/22GdfxF48nNmco0ooq6bDTCI7jNvWU6\n8d9m5+ynZQLe6OGwWvWXxURNjXTjg84I0/tCD5ZfRInW4ab7G/ptmv+uU/BN0lKb\nQW2LW/uc1mRNYiwULh0wysgNd5UGbOmrL6DJhXfhMUQMYSQtpxm8N4qwRUAu7lSR\nB2KBcN45Z4ws1IRmoUdj0cb5EZTr1HcIgKrbWQ9kgHDg3F0nu4Cwy531skRoSMwy\nZiIyUT12aNEUcRQ0ZgmO75Hdz1kB1ctdL0VYYl9/9Hn2u2hCZOCNdodmVHwVfb/S\nAApJ5EkNAgMBAAECggEAJ9WU+4/ZPuYKZSjNZ683iU4nuHFB1zrC9HYAebr3W33P\nIQWijnKWGMttIyVwWmw3hnDta47ecP3M7r0LMqumfSwG3o5AehB9O719bPtXb6Rk\nNPjiZ9qdLxaYq3axGP+C4XQL+6nRKfB+8HvOMzG0KAdm3anMULbVViYQT50cdAgm\nFUd2OEyCtJBhZp9haFaySAFXBaTR62E7yaDHZ6Pjp3Ydmig9EcH3QJMU7XwDSZz0\nTYOplIMynI0UscpQ1Cd20fjHRXgqA6c5ojW7MVHBpBqsV1D12lG5uUdMUR1YzgIK\nF1izourra/zVn4Fjh3WZOlTsgMQSJ8QjZH/JWiLoYQKBgQD622jWqNiQhjicFvKd\nN0CAwdLVtgoRDqG17c0r7DEZ2Gfg0+ZYZ04pH6uzbvEEFIxp+UDRXqdzXroV298h\n2s5VVZdJHZb+c9yV8higbPM5SiNUm75LqT/78K7yKkeD5fOCTksjJI3DSbpYgWi9\nhWzplDoliS+Q1U826WvxEwJ4FQKBgQDZJOrrGauReJPq7+2Du/Q9vTPW0mGV/Uic\nKFE016h8QpTbZSkyJx1Y7dIfoToGzU16Uqq4nsBGf+2unBj9p1oRQ+KTL3YyCC1r\n3d9D/KQq0aVFWERWlze/DyKF8czw5P1jQd7AKbhPMudyzmCFXvy/3nZPAgBykUe8\ntFkiqwkTGQKBgBTA/kV0JqaeVCSlyWC0Z4O/hV/k9aQ/n6VbjTPrEIzg2IdDQLVj\nppXEZwIrVYlO4ecKlhA8UoI6/g486JL2dUeeEywbZJicoU1OgDcVjHHa7l1bnTzJ\nPd/sI60pTk1dQu4u6Ax6Q7g6a05TNoUnesFAYCcm2GaVHz6dxS5msjeZAoGARIQQ\nmAQujaU1TzFLiYCZ7Y0wuT0Cy7fy3EsgbIMLx8GehKej2w5ahT/tSEuwKotHQiyp\nb72vv88H6UuZ2xeeJMp9yKF2Mw0/f8SveR1Tk6s48euLDKOEVIXrB8anOu+WQGZ9\nabcAUAUo4KHb9Nlm+Qex3vYru/q5XwKtCXJcV6kCgYAFfmk76f24vR/Vr8FjSi/P\nVHrSGZHqgcvFTffc11tAAh0vArdxrSDsEd/CUFecXKTgGVg/SUliDBwcy+4n0cKn\nVFrM4wJE6lwAVCpe8zQ8+c1cxPKzHxkop4Wse/V9p3bq6A92m3Ge/0qpuoYjoPD8\nQvsnLWWbVoerGQtniKsX0Q==\n-----END PRIVATE KEY-----\n'
    }
    doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          console.log('Loaded doc: '+info.title+' by '+info.author.email);
          sheet = info.worksheets[0];
          console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
          step();
        });
      },
      function workingWithCells(step) {
        sheet.getRows({
            offset: 1,
            limit: 20
          }, function( err, rows ){
            console.log('Read '+rows.length+' rows');
            for (r of rows) {
              if (r.nick === args[0]) {
                console.log(r.nick,'belső mmr:',r.belsőmmr);
              }
            }
      step();
    });
  }
]);
