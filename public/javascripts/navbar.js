/* affix the navbar after scroll below header */
$('#nav').affix({
  offset: {
    top: $('header').height()-$('#nav').height()
  }
});

/* smooth scrolling for scroll to top */
$('.scroll-top').click(function(){
  $('body,html').animate({scrollTop:0},1000);
});
