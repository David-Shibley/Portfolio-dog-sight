

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
        setImageURL(fileReader.result)
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
