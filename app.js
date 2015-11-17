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
  // API key information
  var clientId = '1ae470d8641474a7bf10';
  var clientSecret = 'baded4ad3c3894bbc8373de7c31e3eef8bac25db';
  // The call to shutterstock server
  var createBrowseImages = function() {
      $.ajax({
      url: 'https://api.shutterstock.com/v2/images/search?query=',
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

        $('#browse').append($imageTemplate);
      }
      // console.log(data);
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
        var processedImage = imgprocess(fileReader.result, true, true, 8);
        setImageURL(processedImage);
      }
      fileReader.readAsDataURL(imgFile);
    // } else if ($('img').hasClass('selected')) {
    //   imgURL = $('.selected').data('url');
    //   console.log(imgURL);
    //   setImageURL(imgURL);
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

  $('button').click(paintPicture);
  $('.make-pic').click(createBrowseImages);


  function setImageURL(url) {
    var imageObj = new Image();
    imageObj.onerror = function(error) {
      console.log(error);
    }
    imageObj.onload = function() {
      context.drawImage(imageObj, 0, 0, televisionWidth, televisionHeight);
    };
    imageObj.src = url;
  }
});
