



const vue= new Vue({
    el: '#app',
    store:store,
    router:router,
    data:{
        drawer: true,
    },
    props: {
        source: String
      },
    mounted:function() {

    },
    computed: {
        ...Vuex.mapState([
            'loading'
        ]),
    }
})

function flatten(data) {
  var result = {};
  function recurse (cur, prop) {
      if (Object(cur) !== cur) {
          result[prop] = cur;
      } else if (Array.isArray(cur)) {
           for(var i=0, l=cur.length; i<l; i++)
               recurse(cur[i], prop ? prop+"."+i : ""+i);
          if (l == 0)
              result[prop] = [];
      } else {
          var isEmpty = true;
          for (var p in cur) {
              isEmpty = false;
              recurse(cur[p], prop ? prop+"."+p : p);
          }
          if (isEmpty)
              result[prop] = {};
      }
  }
  recurse(data, "");
  return result;
}

function obj2array(data, keyStr, valStr) {
  var array = [];
  for(var key in data) {
    var obj = {}
    obj[keyStr] = key
    obj[valStr] = data[key]
    array.push(obj)
  }
  return array
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return ia;
}