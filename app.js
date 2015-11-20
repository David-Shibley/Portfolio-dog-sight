$(document).ready(function() {
  // Setting the television screen as the canvas element
  var canvas = document.getElementById('canvas');
  // Define the demensions of the canvas
  canvas.height = 300;
  canvas.width = 300;
  var context = null;
  // Check to make sure canvas is supported
  if (canvas.getContext) {
    context = canvas.getContext('2d');
  }  else {
    alert('Canvas not supported, please make sure you are using the latest version of your browser.');
  }

  var favoriteImage = localStorage.getItem('favorite')
  var $favoritesImage = $("<img src='" + favoriteImage + "' class='favorite-image'>")
  $('.main').append($favoritesImage);
  // API key information
  var clientId = '1ae470d8641474a7bf10';
  var clientSecret = 'baded4ad3c3894bbc8373de7c31e3eef8bac25db';
  // The call to shutterstock server
  var searchValue = '';
  var setSearchValue = $('#search_bar').keyup(function() {
    searchValue = $(this).val();
  })
  var createBrowseImages = function() {
    console.log(searchValue);
      $.ajax({
      url: 'https://api.shutterstock.com/v2/images/search?query=' + searchValue,
      headers: {
        Authorization: 'Basic ' + window.btoa(clientId + ':' + clientSecret)
      }
    }).done(function(data) {
      // What to do with the data sent back by shutterstock
      for (var i = 0; i < data.data.length; i++) {
        var returnData = data.data[i];
        var previewData = returnData.assets.preview;
        var dataUrl = previewData.url;
        var $imageTemplate = $("<img src=\"" + dataUrl + "\" data-url=\"" + dataUrl + "\"/>");
        $imageTemplate.click(function() {
          setImageURL(this.dataset.url);
        })

        $('#browse').prepend($imageTemplate);
      }
      console.log(data);
    });
  };
  var base64img = canvas.toDataURL();
  // console.log(base64img);

  var televisionHeight = $('#canvas').height();
  var televisionWidth = $('#canvas').width();
  var imgFile = null;
  var imgURL = null;
  var browseSelected = false;

  var paintPicture = function(event) {
    if($('#input_file')[0].files.length > 0){
      imgFile = $('#input_file')[0].files[0];
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var processedImage = fileReader.result;
        setImageURL(processedImage);
      }
      fileReader.readAsDataURL(imgFile);


    }

    else {
      imgURL = $('#input_url').val();
      setImageURL(imgURL);
    }
    event.preventDefault();
  };

  // $('img').click(function() {
  //   console.log('selected');
  //   $(this).toggleClass('selected');
  // })

  $('.submit').click(paintPicture);
  $('.make-pic').click(createBrowseImages);
  $('.favorite-button').click(addFavoritesToLocal);
  $('#search_bar').keypress(function(event) {
    if (event.which == 13) {
      console.log("entered");
      createBrowseImages.call();
    }
  });
  // function loadCanvas() {
  //     var canvas = document.getElementsByClassName("favorites");
  //     var context = canvas.getContext("2d");
  //     var dataURL = localStorage.getItem("favorites");
  //
  //     var img = new Image();
  //     img.src = dataURL;
  //     img.onload = function () {
  //         context.drawImage(img, 0, 0);
  //     };
  //   };
  // window.onload = function () {
  //     loadCanvas();
  //   }
  function addFavoritesToLocal(event) {
    console.log('Clicked');
    var base64image = canvas.toDataURL();
    $favoritesImage = $("<img src='" + base64image + "'>");
    $('.favorites').append($favoritesImage);
    if(typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        localStorage.setItem('favorite', base64image);
    } else {
        console.log('Sorry! No Web Storage support..');
    }
    console.log(base64image);
    }

  function addCurrentToLocal() {
    var base64image = canvas.toDataURL();
    if(typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        localStorage.setItem('watch', base64image);
    } else {
        console.log('Sorry! No Web Storage support..');
    }
  }


  function setImageURL(url) {
    var imageObj = new Image();

    imageObj.onerror = function(error) {
      console.log(error);
    }
    imageObj.onload = function() {
      $('.favorite-image').css('display', 'none');
      context.drawImage(imageObj, 0, 0, televisionWidth, televisionHeight);
      addCurrentToLocal.call();
      var imageData = context.getImageData(0, 0, imageObj.width, imageObj.height)
      // Processing image data
      var data = imageData.data;
      imgprocess(imageData, true, true, 4);
      // r_weight = 0.34;
      // g_weight = 0.5;
      // b_weight = 0.16;
      // r_intensity = 1;
      // g_intensity = 1;
      // b_intensity = 1;
      // for(var i = 0; i < data.length; i += 4) {
      //     var brightness = r_weight * data[i] + g_weight * data[i + 1] + b_weight * data[i + 2];
      //     // red
      //     data[i] = r_intensity * brightness;
      //     // green
      //     data[i + 1] = g_intensity * brightness;
      //     // blue
      //     data[i + 2] = b_intensity * brightness;
      // }
      context.putImageData(imageData, 0, 0);

    };
    imageObj.crossOrigin = 'anonymous';
    if (imageObj.src.indexOf('http') == '0') {
      imageObj.src = 'http://img.g15.xyz/' + url;
    } else {
      imageObj.src = url;
    }
  }

  var extractToken = function(hash) {
    var match = hash.match(/access_token=(\w+)/);
    return !!match && match[1];
  };

  var $post = $('.post');
  var $msg = $('.hidden');

  $post.click(function() {
    var img = canvas.toDataURL();
    localStorage.doUpload = true;
    localStorage.imageBase64 = img.replace(/.*,/, '');
  });

  var token = extractToken(document.location.hash);
  if (token && JSON.parse(localStorage.doUpload)) {
    localStorage.doUpload = false;
    $post.hide();
    $msg.show();

    $.ajax({
      url: 'https://api.imgur.com/3/image',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json'
      },
      data: {
        image: localStorage.imageBase64,
        type: 'base64'
      },
      success: function(result) {
        var id = result.data.id;
        window.location = 'https://imgur.com/gallery/' + id;
      }
    });
  }


});
