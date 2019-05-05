
const axios = require('axios');
require('dotenv').config()
const querystring = require("querystring");

const detectface = function (image, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = image;
    const params = {
        "returnFaceId": true,
        "returnFaceLandmarks": false,
        "returnFaceAttributes":
            "age,gender,smile,facialHair,headPose,glasses,emotion,hair,makeup,accessories,blur,exposure,noise"
    };



    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/detect?${paramstr}`;

    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const createPersonGroup = function (personGroupId, groupName, groupUserData, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = {
        "name": groupName,
        "userData": groupUserData
    };

    const url = `${endpoint}/persongroups/${personGroupId}`;
    httprequest('put', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const deletePersonGroup = function (personGroupId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}`;

    console.log(url);
    httprequest('delete', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const createPersonInGroupPerson = function (groupId, personName, personData, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = {
        "name": personName,
        "userData": personData
    };

    const url = `${endpoint}/persongroups/${groupId}/persons`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const deletePersonOfGroupPerson = function (personGroupId, personId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/persons/${personId}`;

    console.log(url);
    httprequest('delete', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const addFaceToPersonGroupPerson = function (groupId, personId, image, targetFace, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = image;
    const params = {
        "userData": "User-specified data about the target face to add for any purpose. The maximum length is 1KB.   ",
        //"targetFace":"A face rectangle to specify the target face to be added to a person. E.g. "targetFace=10,10,100,100"."
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/persongroups/${groupId}/persons/${personId}/persistedFaces?${paramstr}`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const deleteFaceOfPersonGroupPerson = function (personGroupId, personId, persistedFaceId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/persons/${personId}/persistedFaces/${persistedFaceId}`;

    console.log(url);
    httprequest('delete', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const trainPersonGroup = function (personGroupId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/train `;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const getTrainingStutasOfPersonGroup = function (personGroupId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/training`;

    httprequest('get', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const verifyFace = function (faceId, personGroupId, largePersonGroupId, personId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = {
        "faceId": faceId,
        "personGroupId": personGroupId,
        "largePersonGroupId": largePersonGroupId,
        "personId": personId

    };

    const url = `${endpoint}/verify`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}


const recognizeText = function (image, cb, err) {
    const subscriptionKey = process.env.coginitive_service_vision_key;
    const endpoint = process.env.coginitive_service_vision_endpoint;
    const data = image;
    const params = {
        "mode": "Handwritten",
    };



    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/recognizeText?${paramstr}`;

    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        let resultUrl = response.headers["operation-location"]
        setTimeout(() => {
            httprequest('get', resultUrl, {
                "Ocp-Apim-Subscription-Key": subscriptionKey
            }, data).then(function (response) {
                cb(response.data)
            }).catch(function (e) {
                err(e)
            });
        }, 10000);

    }).catch(function (e) {
        err(e)
    });
}

const ocr = function (image, cb, err) {
    const subscriptionKey = process.env.coginitive_service_vision_key;
    const endpoint = process.env.coginitive_service_vision_endpoint;
    const data = image;
    const params = {
        "language": "unk",
        "detectOrientation": true,
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/ocr?${paramstr}`;
    console.log(url);

    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textAnalyticsInLanguages = function (documents, cb, err) {
    const textAnalyticsKey = process.env.coginitive_service_text_analytics_key;
    const textAnalyticsEndpoint = process.env.coginitive_service_text_analytics_endpoint;

    const data = {
        "documents": documents
    };
    const url = `${textAnalyticsEndpoint}/languages`;
    console.log(JSON.stringify(data));
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": textAnalyticsKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textAnalyticsInKeyPhrases = function (documents, cb, err) {
    const textAnalyticsKey = process.env.coginitive_service_text_analytics_key;
    const textAnalyticsEndpoint = process.env.coginitive_service_text_analytics_endpoint;

    const data = {
        "documents": documents
    };
    const url = `${textAnalyticsEndpoint}/keyPhrases`;
    console.log(JSON.stringify(data));
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": textAnalyticsKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textAnalyticsInSentiment = function (documents, cb, err) {
    const textAnalyticsKey = process.env.coginitive_service_text_analytics_key;
    const textAnalyticsEndpoint = process.env.coginitive_service_text_analytics_endpoint;

    const data = {
        "documents": documents
    };
    const url = `${textAnalyticsEndpoint}/sentiment`;
    console.log(JSON.stringify(data));
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": textAnalyticsKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const bingSearchNews = function (strSearch, cb, err) {
    const bingSearchKey = process.env.coginitive_service_bing_search_key;
    const bingSearchEndpoint = process.env.coginitive_service_bing_search_endpoint;

    const params = {
        "q": strSearch,
        "count":30,
        "offset":0,
        "mkt":"en-us",// "zh-cn",
        //"safeSearch":"Moderate",
        //"freshness":"month"
    };

    const paramstr = querystring.stringify(params);
    const url = `${bingSearchEndpoint}/news/search?${paramstr}`;
    console.log(url);
    httprequest('get', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": bingSearchKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const httprequest = function (method, url, headers, data) {

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    })
}


module.exports = {
    detectface: detectface,
    recognizeText: recognizeText,
    ocr: ocr,

    createPersonGroup: createPersonGroup,
    deletePersonGroup: deletePersonGroup,
    createPersonInGroupPerson: createPersonInGroupPerson,
    deletePersonOfGroupPerson: deletePersonOfGroupPerson,
    addFaceToPersonGroupPerson: addFaceToPersonGroupPerson,
    deleteFaceOfPersonGroupPerson: deleteFaceOfPersonGroupPerson,
    trainPersonGroup: trainPersonGroup,
    getTrainingStutasOfPersonGroup: getTrainingStutasOfPersonGroup,
    verifyFace: verifyFace,

    textAnalyticsInLanguages: textAnalyticsInLanguages,
    textAnalyticsInKeyPhrases: textAnalyticsInKeyPhrases,
    textAnalyticsInSentiment: textAnalyticsInSentiment,
    bingSearchNews: bingSearchNews
}