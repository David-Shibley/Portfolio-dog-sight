

$(document).ready(function() {
  var canvas = document.getElementById('canvas');
  var context = null;
  var backgroundPic = new Image();
  if (canvas.getContext) {
    context = canvas.getContext('2d');
  }  else {
    alert('Canvas not supported');
  }

  var base64img = canvas.toDataURL();
  console.log(base64img);
  $('button').click(function(event) {
    var imgURL = $('#input_url').val();
    var imageObj = new Image();
    event.preventDefault();
    imageObj.onerror = function(error) {
      console.log(error);
    }
    imageObj.onload = function() {
      context.drawImage(imageObj, 0, 0);
    };
    imageObj.src = imgURL;
  });
});
