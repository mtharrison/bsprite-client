(function(global) {
  
  "use strict";

  // https://gist.github.com/jonleighton/958841
  function base64ArrayBuffer(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
      d = chunk & 63 // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]

      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
  }

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  var BSprite = function() {};

  BSprite.getImages = function(url, callback) {

    var images = [];

    var req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.open('GET', url, true);

    req.send();

    req.onload = function() {
      var buff = req.response;

      var mposition = req.getResponseHeader('X-Metadata-Offset');

      var mdatabuff = buff.slice(mposition);

      var mdata = JSON.parse(ab2str(mdatabuff));

      for (var i = 0; i < mdata.length; i++) {
        var imgMetaData = mdata[i];
        var imgData = buff.slice(imgMetaData.Offset, imgMetaData.Offset + imgMetaData.Length)
        var base64Data = base64ArrayBuffer(imgData);

        var img = document.createElement('img');
        img.src = 'data:' + imgMetaData.MimeType + ';base64,' + base64Data
        images.push(img);
        callback(images);
      }

    }
  }

  global.BSprite = BSprite;

})(window);