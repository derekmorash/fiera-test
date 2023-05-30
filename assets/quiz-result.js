$(document).ready(function(){
  //var cookie = getCookie('quiz-result');
  //console.log(cookie);
  var main_url = window.location.href;
  var parts = main_url.split("/");
  var shade_name = parts[5];
  //var d = JSON.parse(cookie);
  //console.log(d);
  $.ajax({
    type: 'GET',
    url: '/products/fiera-luxury-concealer-'+shade_name+'.js',
    dataType: 'json',
    success: function(product) {
      //console.log(d.shade);
      //var shade_name = shade_name;
     // var new_shade = shade_name.replace(/ /g,"_");
      $('.chosn-color').addClass(shade_name);
      $('.chosn-color2').addClass(shade_name);
      //$('.chosn-size').text(shade_name);
      var t = product.title;
      t = t.split(' - ');
      $('.prod-nameHdng').text(t[0]);
      $('.chosn-size').text(t[1]);
      $('.chosn-size2').text('Shade '+t[1]);
      
      $('.prod-Price').text(Shopify.formatMoney(product.price_max));
            
      var img_nav_html = '', img_main_html = '';
      
      $(product.media).each(function(k,v){
        if(v.src != undefined){
          img_nav_html += `<div><img src="${v.src}" class="prd-nav" alt="img"></div>`;
          img_main_html += `<div><img src="${v.src}" class="prd-slide" alt="img"></div>`;
        }
      });
      
      $('.add-to-cart-btn').attr('data-variant', product.variants[0].id);
      $('.add-to-cart-btn').attr('data-selling-plan', product.variants[0].selling_plan_allocations[0].selling_plan_id);
      
      if(img_nav_html != undefined){
        //$('.slider-nav-custom').slick('unslick');
        //$('.slide-div-custom').slick('unslick');
        
        $('.slider-nav-custom').html(img_nav_html);
        $('.slide-div-custom').html(img_main_html);
        
        $('.slider-nav-custom').addClass('slider-nav');
        $('.slide-div-custom').addClass('slide-div');
        
        $('.slide-div-custom').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: false,
          asNavFor: '.slider-nav-custom',
          autoplay: false,
          autoplaySpeed: 11000,
          dots: false,
          responsive: [
            {
              breakpoint: 999,
              dots: false,
            },
            {
              breakpoint: 767,
              settings: {
                dots: false,
              }
            }
          ]
        });

        $('.slider-nav-custom').slick({
          slidesToShow:5,
          slidesToScroll: 1,
          infinite:false,
          asNavFor: '.slide-div-custom',
          dots: false,
          centerMode: false,
          focusOnSelect: true,
          arrows: false,
        });

        $(".next-click").click(function(event){
          $(".slide-div-custom").slick("refresh");
        });        
      }
    },
    error:function(err){
      console.log(err);
    }
  });
  
  $('.add-to-cart-btn').on('click', function(){
    let variant = $(this).data('variant');
    let selling_plan = $(this).data('selling-plan');
    if(variant != undefined){
    
    
    //console.log(variant);
   // console.log(selling_plan);
    var proceed = true;
    $.ajax({
      type: 'GET',
      url: '/cart.js',
      dataType: 'json',
      success: function(cart) {
        var cart_id = [];
        var i = 0;
        if(cart.items != ''){
          $( cart.items ).each(function( index,value ) {
             cart_id[i++] = value.id;
          });
            console.log(cart_id);
          console.log(variant);
            if($.inArray(variant, cart_id) != -1)
            {
              $('.already_added').show();
             
            }
            else 
            { 
              let formData = {
                'items': [{
                  'id': variant,
                  'selling_plan': selling_plan,
                  'quantity': 1
                }]
              };
                fetch('/cart/add.js', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(formData)
                })
                .then(response => {
                  let data = response.json();
                 window.location.href = '/pages/quiz-upsell';
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
              } 
         }
        
        else{
        
          var formData = {
            'items': [{
              'id': variant,
              'selling_plan': selling_plan,
              'quantity': 1
            }]
          };
         // console.log('hii');
          fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            let data = response.json();
            window.location.href = '/pages/quiz-upsell';
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }
        
      },
    });
}
  });
  
  $(".next-click").click(function(event){
    $(".slide-div-custom").slick("refresh");
  });

  $('.pop-tab-opt li').click(function(e) {
    $('.pop-tab-opt li').removeClass('active');
    $(this).addClass('active');
  });

  $('#pop-tab1').click(function(e) {
    $('.ingrent-tab').hide();
    $('.keyfact-tab').fadeIn();		
  });

  $('#pop-tab2').click(function(e) {
    $('.keyfact-tab').hide();
    $('.ingrent-tab').fadeIn();
  });

  $('.get-popup').click(function(e) {
    $('#tab-popup').fadeIn();
  });


  $('.close-pop').click(function(e) {
    $('#tab-popup').fadeOut();
  });
});