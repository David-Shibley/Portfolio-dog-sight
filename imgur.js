$(function () {
  var extractToken = function(hash) {
    var match = hash.match(/access_token=(\w+)/);
    return !!match && match[1];
  };

  var $post = $('.post');
  var $msg = $('.hidden');
  var img = base64input;

  $post.click(function() {
    localStorage.doUpload = true;
    localStorage.imageBase64 = img;
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
