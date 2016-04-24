/* affix the navbar after scroll below header */
$('#nav').affix({
  offset: {
    top: $('header').height()-$('#nav').height()
  }
});

$('#nav').affix({
  offset: {
    top: $('small_header').height()-$('#nav').height()
  }
});

/* highlight the top nav as scrolling occurs */
$('body').scrollspy({ target: '#nav' })

/* smooth scrolling for scroll to top */
