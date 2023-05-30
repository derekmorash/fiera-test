// tabbed content
// http://www.entheosweb.com/tutorials/css/tabs.asp
$(".tab-container .tab_content").hide();
// $(".tab-container .tab_content:first").show();

if ($(window).width() <= 767) {
  $('.tab-container').each(function(k,v){
    $(v).find('.tab_content:first').show();
  });
}
else {
  $('.tab-container').each(function(k,v){
    $('.first_tab').addClass('active');
    $(v).find('.tab_content:first').show();
  });
}


/* if in tab mode */
$("ul.tabs li").click(function() {
  var parent = $(this).parents('.tab-container');

  $(parent).find(".tab_content").hide();
  var activeTab = $(this).attr("rel");
  $(parent).find("#"+activeTab).fadeIn();

  $(parent).find("ul.tabs li").removeClass("active");
  $(this).addClass("active");

  

  $(parent).find(".tab_drawer_heading").removeClass("d_active");
  $(parent).find(".tab_drawer_heading[rel^='"+activeTab+"']").addClass("d_active");

});
/* if in drawer mode */
$(".tab_drawer_heading").click(function() {
  
  if($( ".tab_drawer_heading" ).hasClass( "d_active" )){
    $( '.tab_drawer_heading' ).removeClass("d_active");
    $('.tab_content').hide();
  }
  else{
    var parent = $(this).parents('.tab-container');
    $(parent).find(".tab_content").hide();
    var d_activeTab = $(this).attr("rel");
    $(parent).find("#"+d_activeTab).fadeIn();

    $(parent).find(".tab_drawer_heading").removeClass("d_active");
    $(this).addClass("d_active");

    $(parent).find("ul.tabs li").removeClass("active");
    $(parent).find("ul.tabs li[rel^='"+d_activeTab+"']").addClass("active");
  }
});


/* Extra class "tab_last"
   to add border to right side
   of last tab */
$('ul.tabs li').last().addClass("tab_last");
