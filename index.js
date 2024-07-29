const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_KEY =  process.argv[2];

console.log(`STARTING: ${new Date().toLocaleTimeString()}`);
(async () => {
  for (let index = 0; index < 2; index++) {
    let uploadData = new FormData();
    uploadData.append('json', '1');
    uploadData.append('entryMethod', 'FILE_UPLOAD');
    uploadData.append('upload_files', fs.createReadStream('/Users/farmas/dev/temp/docfinity-document-creator/file.txt'));

    let uploadConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://uw.cloudtest.docfinity.com/docfinity/servlet/upload',
      headers: { 
        'X-XSRF-TOKEN': 'federico', 
        'Cookie': 'XSRF-TOKEN=federico', 
        'Authorization': 'Bearer ' + API_KEY, 
        ...uploadData.getHeaders()
      },
      data : uploadData
    };

    const uploadResponse = await axios.request(uploadConfig);
    const documentId = uploadResponse.data;
    console.log(`(${index+1}) Uploaded '${documentId}'`);

    let commitData = JSON.stringify([
      {
        "documentId": documentId,
        "documentTypeId": "00000001fh8s2pqf0zvs47geb8x33nmz",
        "documentIndexingMetadataDtos": [
          {
            "metadataId": "00000001fdbzdgnahby882x9k0tdvvnk",
            "value": "Sample Record Type"
          },
          {
            "metadataId": "00000001fx6by80790ahx013g0nf7dh1",
            "value": "Title from CLI - " + index
          },
          {
            "metadataId": "00000001fdbxpnnxj48g53b8wmhyb3xw",
            "value": 1677700800000
          }
        ],
        "metadataLoaded": true
      }
    ]);
    
    let commitConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://uw.cloudtest.docfinity.com/docfinity/webservices/rest/indexing/index/commit',
      headers: { 
        'Content-Type': 'application/json', 
        'X-XSRF-TOKEN': 'federico', 
        'Cookie': 'XSRF-TOKEN=federico', 
        'Authorization': 'Bearer ' + API_KEY, 
      },
      data : commitData
    };

    await axios.request(commitConfig);
    console.log(`(${index+1}) Committed`);  
  }

  console.log(`ENDED: ${new Date().toLocaleTimeString()}`);

})().catch(e => {
  throw e;
});




