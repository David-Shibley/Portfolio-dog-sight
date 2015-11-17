

$(document).ready(function() {
  var canvas = document.getElementById('canvas');
  canvas.height = 300;
  canvas.width = 300;
  var context = null;
  var backgroundPic = new Image();
  if (canvas.getContext) {
    context = canvas.getContext('2d');
  }  else {
    alert('Canvas not supported');
  }

  // $.get('https://api.shutterstock.com/v2/images/search?fields=data(id,preview_url)', function(data) {

  var clientID = '1ae470d8641474a7bf10';
  var clientSecret = 'baded4ad3c3894bbc8373de7c31e3eef8bac25db';
  $.ajax({
    url: 'https://api.shutterstock.com/v2/images/search?query=*',
    headers: {
      Authorization: 'Basic ' + window.btoa(clientID + ':' + clientSecret)
    }
  }).done(function(data) {
    dataStuff = data;
    console.log(dataStuff);
  })

  var base64img = canvas.toDataURL();
  console.log(base64img);

  var televisionHeight = $('#canvas').height();
  var televisionWidth = $('#canvas').width();
  var imgFile = null;
  var imgURL = null;
  var paintPricture = function(event) {
    if($('#input_file')[0].files.length > 0){
      imgFile = $('#input_file')[0].files[0];
      var fileReader = new FileReader();
      fileReader.onload = function() {
        console.log(fileReader.result);
        var processedImage = imgprocess(fileReader.result, true, true, 8);
        console.log(processedImage);
        setImageURL(processedImage);
      }
      fileReader.readAsDataURL(imgFile);
    } else {
      imgURL = $('#input_url').val();
      setImageURL(imgURL);
    }
    event.preventDefault();
  };

  $('button').click(paintPricture);


  function setImageURL(url) {
    var imageObj = new Image();
    imageObj.onerror = function(error) {
      console.log(error);
    }
    imageObj.onload = function() {
      context.drawImage(imageObj, 0, 0, televisionWidth, televisionHeight);
    };
    imageObj.src = url;

    console.log(televisionWidth);
  }
});
