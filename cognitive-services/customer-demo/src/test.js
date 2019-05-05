
const util = require('./util.js');

const fs = require('fs');

function test_detectface() {
    fs.readFile('./testimgs/detectface.jpg', function (err, data) {
        if (err) throw err;
        util.detectface(data, (response) => {
            console.log(response)
        }, (error) => {
            console.error(error)
        })
    })
}

function test_createGroup(groupId, groupName, groupUserData) {
    console.log("createGroup Id: " + groupId);
    util.createPersonGroup(groupId, groupName, groupUserData, (response) => {
        console.log(response);
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_createGroupPerson(groupId, personName, personData) {
    console.log("createGroupPerson Id: " + groupId);
    util.createPersonInGroupPerson(groupId, personName, personData, (response) => {
        console.log(response);

    }, (error) => {
        console.error(error);
    })
}

function test_addFacesToPersonGroup(name, groudId, personId, targetFace) {
    var dir = "./src/testimgs";
    var files = fs.readdirSync(dir);
    console.log(files.length);
    files.forEach(function (filename) {
        console.log("detecting: " + filename)
        if (filename.indexOf(name) != -1) {
            fs.readFile('./src/testimgs/' + filename, function (err, data) {
                if (err) throw err;
                util.addFaceToPersonGroup(groudId, personId, data, targetFace, (response) => {
                    console.log("detected: " + filename)
                    console.log(response);
                    //console.log(JSON.stringify(response, null, 2));

                }, (error) => {
                    console.error(error);
                });
            });
        }
    })
}

function test_TrainPersonGroup(groupId) {
    util.trainPersonGroup(groupId, (response) => {
        console.log(response);
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_getTrainingStatusOfPersonGroup(groupId) {
    util.getTrainingStutasOfPersonGroup(groupId, (response) => {
        console.log(response);
        console.log(JSON.stringify(response, null, 2));
    }, (error) => {
        console.error(error);
    })
}

function test_detectFace(filePath, filename) {
    var name = filename.substring(0, filename.indexOf(' '));
    fs.readFile(filePath + filename, function (err, data) {
        if (err) throw err;
        util.detectface(data, (response) => {
            console.log("detected: " + filename)
            console.log(JSON.stringify(response, null, 2));
            for (var item of response) {
                console.log("faceId:" + item.faceId);
            }
        }, (error) => {
            console.error(error);
        })
    });
}

function test_ocr() {

}



function test_verifyFace(faceId, personGroupId, largePersongroupId, personId) {
    util.VerifyFace(faceId, personGroupId, largePersongroupId, personId, (response) => {
        console.log(response)

    }, (error) => {
        console.error(error);
    })
}

function test_deletePersonGroup(personGroupId) {
    util.deletePersonGroup(personGroupId, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_deletePersonOfPersonGroup(personGroupId, personId) {
    util.deletePersonOfGroupPerson(personGroupId, personId, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_deleteFaceOfPersonGroupPerson(personGroupId, personId, persistedFaceId) {
    util.deleteFaceOfPersonGroupPerson(personGroupId, personId, persistedFaceId, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_textAnalyticsInLanguages() {
    
    var str = `[
        {
          "id": "1",
          "text": "Hello world"
        },
        {
          "id": "2",
          "text": "Bonjour tout le monde"
        },
        {
          "id": "3",
          "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
        },
        {
          "id": "4",
          "text": ":) :( :D"
        },
        {
          "id": "5",
          "text": "囧"
        }
      ]    
    `;
    var documents = JSON.parse(str);
    util.textAnalyticsInLanguages(documents, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_textAnalyticsInKeyPhrases() {
    var str = `[
        {
          "language": "en",
          "id": "1",
          "text": "Hello world. This is some input text that I love."
        },
        {
          "language": "fr",
          "id": "2",
          "text": "Bonjour tout le monde"
        },
        {
          "language": "es",
          "id": "3",
          "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
        }
      ]
    `;
    var documents = JSON.parse(str);
    util.textAnalyticsInKeyPhrases(documents, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_textAnalyticsInSentiment() {
    var str = `[
    {
      "language": "en",
      "id": "1",
      "text": "Bad world. This is some input text that I hate."
    },
    {
      "language": "fr",
      "id": "2",
      "text": "Bonjour tout le monde"
    },
    {
      "language": "es",
      "id": "3",
      "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
    }
  ]
`;
    var documents = JSON.parse(str);
    util.textAnalyticsInSentiment(documents, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_bingSearchNews(strSearch) {
    util.bingSearchNews(strSearch, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

//test_textAnalyticsInLanguages();
test_textAnalyticsInKeyPhrases();
//test_textAnalyticsInSentiment();
//test_bingSearchNews("USA");

//test_createGroup("test_pg_01","Test Person Group","group user data");
//test_createGroupPerson("test_pg_01","Ronaldo","user data");
//test_addFacesToPersonGroup("Ronaldo", "test_pg_01", "1b0c44c5-dce1-4845-8ca0-575c085c6cf7", null);
//test_trainPersonGroup("test_pg_01");
//test_getTrainingStatusOfPersonGroup("test_pg_01");
//test_detectFace('./src/verifyImgs/',"Ronaldo 06.jpg");
//test_verifyFace("184a541b-1980-4862-9626-0a9f187a16e6", "test_pg_01", null, "2a93b29b-af58-4a8a-b094-39169aa7a820");

//test_deletePersonGroup("test_pg_01");
//test_deleteFaceOfPersonGroupPerson("test_pg_01","1b0c44c5-dce1-4845-8ca0-575c085c6cf7","e0ecb138-0a22-4ae4-bdb7-ed6d8802a855");
//test_deletePersonOfPersonGroup("test_pg_01","1b0c44c5-dce1-4845-8ca0-575c085c6cf7");
