$(document).ready(function(){
  var d = 'fiera-apple-stem-cell-cream-free-trial';
	$.ajax({
    type: 'GET',
    url: '/products/'+d+'.js',
    dataType: 'json',
    success: function(product) {
      //console.log(d.shade);
      //var shade_name = d.shade;
     // var new_shade = shade_name.replace(/ /g,"_");
     // $('.chosn-color').addClass(new_shade);
     // $('.chosn-color2').addClass(new_shade);
     // $('.chosn-size').text(d.shade);
      var t = product.title;
      t = t.split(' - ');
      $('.prod-nameHdng').text(t[0]);

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
  
  $('.thanx_text').on('click', function(){
  	
    window.location.href = '/cart';
  
  });
  
  $('.add-to-cart-btn').on('click', function(){
    let variant = $(this).data('variant');
    let selling_plan = $(this).data('selling-plan');
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
            console.log('sadsdf');
            fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            })
            .then(response => {
              let data = response.json();
              window.location.href = '/cart';
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
          console.log('hii');
          fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            let data = response.json();
            window.location.href = '/cart';
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }

      },
    });

  });

  });