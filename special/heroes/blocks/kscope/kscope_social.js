$('body').on('click', '.header-social a', function (e) {
  var url, title;

  e.stopPropagation();

  url = $(e.currentTarget).attr('href');

  if ($(this).parent().hasClass('tw')) {

    title = encodeURIComponent($('meta[property=\'og:title\']').attr('content') || $(document).attr('title'));

    url += '&text=' + title + '&via=championat';

    $(this).attr('href', url);

  }

  // mobile can not open new window wia javascript
  // for mobile using native target="_blank"
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    e.preventDefault();

    window.open(
      url, 'targetWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes,resizable=yes, width=700, height=400'
    );
  }

});