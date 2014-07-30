bsprite-client
==========

A browser library for working with bsprites

##Public methods

**BSprite.getImages** Requests a sprite package of images

    BSprite.getImages = function(url, callback)

##Usage

Example of loading a named sprite package of images and appending them to the document

    var images = BSprite.getImages('http://127.0.0.1:8080/images', function(images){
        for(var i = 0; i < images.length; i++){
            document.body.appendChild(images[i]);
        }
    });