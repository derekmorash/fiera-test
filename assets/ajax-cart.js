var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
window.addEventListener('DOMContentLoaded', function() {
  const defaults = {
      cartModal: '.js-ajax-cart-modal', // classname
      cartModalContent: '.js-ajax-cart-modal-content', // classname
      cartModalClose: '.js-ajax-cart-modal-close', // classname
      cartDrawer: '.js-ajax-cart-drawer', // classname
      cartDrawerContent: '.js-ajax-cart-drawer-content', // classname
      cartDrawerClose: '.js-ajax-cart-drawer-close', // classname
      cartDrawerTrigger: '.js-ajax-cart-drawer-trigger', // classname
      cartOverlay: '.js-ajax-cart-overlay', // classname
      addToCart: '.js-ajax-add-to-cart', // classname
      checkoutButton: '.js-ajax-checkout-button',
      cartCounter: '.js-ajax-cart-counter', // classname
      removeFromCart: '.js-ajax-remove-from-cart', //classname
      removeFromCartNoDot: 'js-ajax-remove-from-cart', //classname,
  };

  const cartModal = document.querySelector(defaults.cartModal);
  const cartModalContent = document.querySelector(defaults.cartModalContent);
  const cartModalClose = document.querySelector(defaults.cartModalClose);
  const cartDrawer = document.querySelector(defaults.cartDrawer);
  const cartDrawerContent = document.querySelector(defaults.cartDrawerContent);
  const cartDrawerClose = document.querySelector(defaults.cartDrawerClose);
  const cartDrawerTrigger = document.querySelector(defaults.cartDrawerTrigger);
  const cartOverlay = document.querySelector(defaults.cartOverlay);
  const cartCounter = document.querySelector(defaults.cartCounter);
  const addToCart = document.querySelectorAll(defaults.addToCart);
  let removeFromCart = document.querySelectorAll(defaults.removeFromCart);
  const checkoutButton = document.querySelector(defaults.checkoutButton);
  const htmlSelector = document.documentElement;
  
  for (let i = 0; i < addToCart.length; i++) {
   
      addToCart[i].addEventListener('click', function(event) {

          event.preventDefault();
          const formID = $(this).closest('form').attr('id');
          //const formID = 'product_form_4628737589338';
        //	alert($('#' + formID).serialize());
       // alert($('#' + formID).find('input[type="hidden"], select').serialize());
        
        var getQty = $('.totalqty').val();

        if(getQty == 'null' && $('#conBuy3').hasClass("active")){

          $('.add-btn-error').html('Please select 3 Shade options');
        }
        else if(getQty == 3 && $('#conBuy3').hasClass("active")){
          var item_array = [];
          var formserdata = $('#' + formID).find('input[type="hidden"], select').serializeArray();
          var selling_plan = $('.rc-selling-plans__dropdown').serializeArray();

         console.log(formserdata);
          var data = {};
          $(formserdata).each(function(index, obj){
              data[obj.name] = obj.value;
          });
          
          var vardataitem = [];
          $( ".hiddenqty" ).each(function( index ){
            var qty = $( this ).val();
            
            if(qty != 0)
            {   
              var variant_id = $(this).attr('data-varid');
              if(selling_plan != ''){
                if(index == 0){
                  item_array.push({'id':variant_id,'quantity':qty, 'selling_plan':selling_plan[0]['value'], 'properties': {'_free_product': 1}});
                }else{
                  item_array.push({'id':variant_id,'quantity':qty, 'selling_plan':selling_plan[0]['value']});
                }
              }
              else{
              item_array.push({'id':variant_id,'quantity':qty });
              }
              
              //item_array.push({'id':variant_id,'quantity':qty, 'selling_plan':selling_plan[0]['value']});
              vardataitem.push(variant_id);
            }

          });
          
          if($(".def-rad").is(':checked')){
            item_array.push({'id':42406289342694,'quantity':1});
          }
          
          console.log(item_array);
          
          localStorage.setItem("vardataitem", JSON.stringify(vardataitem));

          jQuery.post('/cart/add.js',{items:item_array});
          
          setTimeout(function() {
            openCartDrawer();
            openCartOverlay();
            fetchCart();
            }, 1000);
        }
        else{        
        	addProductToCart(formID);
            openCartDrawer();
          	openCartOverlay();
        }
      });
  }

  function addProductToCart(formID) {
     var arraydata = []; var item_array1 = [];
     arraydata = $('#' + formID).find('input[type="hidden"], select').serializeArray();
    var selling_plan = $('.rc-selling-plans__dropdown').serializeArray();
    

    console.log(arraydata);
          var data = {};
          $(arraydata).each(function(index, obj){
              data[obj.name] = obj.value;
            
          });
    
          if(selling_plan != ''){
            item_array1.push({'id':data['id'],'quantity':data['quantity'], 'selling_plan':selling_plan[0]['value']});
          }
          else{
            item_array1.push({'id':data['id'],'quantity':data['quantity']});
          }
    	
   
    	if($(".def-rad").is(':checked')){
      		item_array1.push({'id':'42406289342694','quantity':'1'});
          }
    
        if($(".def-rad-apple").is(':checked')){
          item_array1.push({'id':'42406233899238','quantity':'1'});
        }
        if($(".def-rad-apple-stem-cell").is(':checked')){
          item_array1.push({'id':'42409399714022','quantity':'1'});
        }
   
      $.ajax({
          type: 'POST',
          url: '/cart/add.js',
          dataType: 'json',
          data:{items:item_array1},
          success: addToCartOk,
          error: addToCartFail,
      });
  }

  function fetchCart() {
      $.ajax({
          type: 'GET',
          url: '/cart.js',
          dataType: 'json',
          success: function(cart) {
              onCartUpdate(cart);

              if (cart.item_count === 0) {
                  cartDrawerContent.innerHTML = 'Cart is empty';
                  checkoutButton.classList.add('is-hidden');
              } else {
                  renderCart(cart);
                  checkoutButton.classList.remove('is-hidden');
              }

          },
      });
  }

  function changeItem(line, callback) {
      const quantity = 0;
      $.ajax({
          type: 'POST',
          url: '/cart/change.js',
          data: 'quantity=' + quantity + '&line=' + line,
          dataType: 'json',
          success: function(cart) {
              if ((typeof callback) === 'function') {
                  callback(cart);
              } else {
                  onCartUpdate(cart);
                  fetchCart();
                  removeProductFromCart();
              }
          },
      });
  }

  function onCartUpdate(cart) {
   
//       console.log('items in the cart?', cart.item_count);
      $('.js-ajax-cart-counter').text(cart.item_count);
    if(cart.item_count == 0){
      var cart_total_header = Shopify.formatMoney(cart.total_price);
      $('.data-subtotal').text('CART TOTAL: '+ cart_total_header);
    }

  }

  function addToCartOk(product) {

     // cartModalContent.innerHTML = product.title + ' was added to the cart!';
      //cartCounter.innerHTML = Number(cartCounter.innerHTML) + 1;
      openAddModal();
      openCartOverlay();
      fetchCart();
  }

  function removeProductFromCart() {
     // cartCounter.innerHTML = Number(cartCounter.innerHTML) - 1;
  }

  function addToCartFail() {
      cartModalContent.innerHTML = 'The product you are trying to add is out of stock.';
      openAddModal();
      openCartOverlay();
  }

  function renderCart(cart) {

    var cart_total_header = Shopify.formatMoney(cart.total_price)
    
    $('.data-subtotal').text(Shopify.formatMoney(cart.total_price));
    $('.data-subtotal').text('CART TOTAL: '+ cart_total_header);


      clearCartDrawer();

      cart.items.forEach(function(item, index) {

          //console.log(item.title);
          //console.log(item.image);
          //console.log(item.line_price);
          //console.log(item.quantity);

            const productTitle = '<div class="ajax-cart-item__title"><span class="item_title">' + item.title + '</span><div class="ajax-cart-item__price">' + Shopify.formatMoney(item.line_price) + '</div> </div>';
            const productImage = '<img class="ajax-cart-item__image" src="' + item.image + '" >';
            //const productPrice = '<div class="ajax-cart-item__price">' + Shopify.formatMoney(item.line_price) + '</div>';
           //const productQuantity = '<div class="ajax-cart-item__quantity">' + item.quantity + '</div>';
            const productRemove = '<div data-var-id="'+ item.variant_id+'" class="ajax-cart-item__remove ' + defaults.removeFromCartNoDot + '"></div>';
         
        
        
          const MiniCartQty = '<div class="mini_qtybox" data-mini-id="'+ item.variant_id+'"><span class="mini_btnqty qtyminus icon icon-minus">-</span><input type="text" id="quantity" name="quantity" min="1" value="'+item.quantity+'" class="quantity-selector quantity-input" readonly=""><input type="hidden" value="'+item.variant_id+'" class="mini_cart_variant_id"><input type="hidden" value="'+item.quantity+'" class="mini_cart_product_qty"><span class="mini_btnqty qtyplus icon icon-plus">+</span></div>';

          const concatProductInfo = '<div class="ajax-cart-item__single" data-itemid="'+ item.variant_id+'" data-line="' + Number(index + 1) + '">' +  productImage + productTitle + MiniCartQty + productRemove + '</div>';

          cartDrawerContent.innerHTML = cartDrawerContent.innerHTML + concatProductInfo;

      });
    
     var varDataItem = JSON.parse(localStorage.getItem("vardataitem"));
  
        $( ".mini_qtybox" ).each(function( index ){
          var DataVarId = $(this).attr('data-mini-id');
        
                   if(jQuery.inArray(DataVarId, varDataItem) != -1) {
                      $(this).hide();

              		}
          
          var otherInput = $(this).parent('.ajax-cart-item__single').find('.item_title').html();
          
          
          if(otherInput.indexOf('Buy 2 + Get 1 Free /') != -1){
               $(this).hide();
          }

            });

      // document.querySelectorAll('.js-ajax-remove-from-cart')
      //     .forEach((element) => {
      //         element.addEventListener('click', function() {
      //             const lineID = this.parentNode.getAttribute('data-line');
      //             console.log('aa');
      //         });
      //     });

      removeFromCart = document.querySelectorAll(defaults.removeFromCart);

      for (let i = 0; i < removeFromCart.length; i++) {
          removeFromCart[i].addEventListener('click', function() {
             
              //console.log(line);
            	const DataVarId = this.getAttribute('data-var-id');

             var varDataItem = JSON.parse(localStorage.getItem("vardataitem"));
           
            if(jQuery.inArray(DataVarId, varDataItem) != -1) {
              
              var datalength = varDataItem.length;
          
              for (let i = 0; i < varDataItem.length; ++i) {

                  var qty = 0;
                  var data = { updates: {} };

                  for (i = 0; i < varDataItem.length; i++) {
                    data.updates[varDataItem[i]] = qty;
                  }

                  jQuery.ajax({
                    type: 'POST',
                    url: '/cart/update.js',
                    data: data,
                    dataType: 'json',
                    success: function(cart) {
                        if ((typeof callback) === 'function') {
                            callback(cart);
                        } else {
                            onCartUpdate(cart);
                            fetchCart();
                            removeProductFromCart();
                        }
                    }
                  });

                  
              }
              

            } else {
                 const line = this.parentNode.getAttribute('data-line');
                 changeItem(line);
            }
          });
      }

  }

  function openCartDrawer() {
    if($('.js-ajax-add-to-cart').hasClass('popopend')){
    
    }
    else{
      cartDrawer.classList.add('is-open');
      document.querySelector('body').classList.add('cart-drawer-open');
    }
  }

  function closeCartDrawer() {
      cartDrawer.classList.remove('is-open');
    document.querySelector('body').classList.remove('cart-drawer-open');
  }

  function clearCartDrawer() {
      cartDrawerContent.innerHTML = '';
  }

  function openAddModal() {
      cartModal.classList.add('is-open');
  }

  function closeAddModal() {
      cartModal.classList.remove('is-open');
  }

  function openCartOverlay() {
      cartOverlay.classList.add('is-open');
      htmlSelector.classList.add('is-locked');
  }

  function closeCartOverlay() {
      cartOverlay.classList.remove('is-open');
      htmlSelector.classList.remove('is-locked');
  }

  cartModalClose.addEventListener('click', function() {
      closeAddModal();
      closeCartOverlay();
  });

  cartDrawerClose.addEventListener('click', function() {
      closeCartDrawer();
      closeCartOverlay();
  });
  // cart is empty stanje
  cartOverlay.addEventListener('click', function() {
      closeAddModal();
      closeCartDrawer();
      closeCartOverlay();
  });

  cartDrawerTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      fetchCart();
      openCartDrawer();
      openCartOverlay();
  });

  document.addEventListener('DOMContentLoaded', function() {
      fetchCart();
  });


  $(document).on("click",".mini_qtybox .mini_btnqty",function() {

    var qty = parseInt($(this).parent('.mini_qtybox').find('.quantity-input').val());
    //var pro_qty = $(this).parent('.mini_qtybox').find('.mini_cart_product_qty').val();
    var pro_variation_id = parseInt($(this).parent('.mini_qtybox').find('.mini_cart_variant_id').val());
    var line = $(this).closest('.ajax-cart-item__single').attr('data-line');
	
    if($(this).hasClass('qtyplus')) {
      changeQunatity(line , qty);
      qty++;
      
      
    }else {

      if(qty > 1) {
        qty--;
      }
      //pro_qty = parseInt(pro_qty)-1;
      if(qty > 0){
        removeSigleQtyItem(line, qty)
      }else{
        changeItem(line);
      }
    }
    qty = (isNaN(qty))?1:qty;
    $(this).parent('.mini_qtybox').find('.quantity-input').val(qty);
  });
  function changeQunatity(line , qty){
  
	 $.ajax({
          type: 'POST',
          url: '/cart/change.js',
          data: 'quantity=' + (++qty) + '&line=' + line,
          dataType: 'json',
          success: function(cart) {
              fetchCart();
          },
      });
  }

  function removeSigleQtyItem(line, quantity) {
   
      
      $.ajax({
          type: 'POST',
          url: '/cart/change.js',
          data: 'quantity=' + (--quantity) + '&line=' + line,
          dataType: 'json',
          success: function(cart) {
              fetchCart();
          },
      });
  }

      $('.pop-open').click(function(ee) {
        ee.preventDefault();
        
        $(this).addClass('popopend');
		
        $('.shade-popup .shade-error').hide();
        $("[name='offers']").removeClass();
        $("[name='offers1']").removeClass();
        $("[name='offers2']").removeClass();
        
        if ($("[name='selector']:checked").val() == 3){
          $("[name='offers1']").show();
          $("[name='offers2']").show();
        } else {
          $("[name='offers1']").val("");
          $("[name='offers2']").val("");
          $("[name='offers1']").hide();
          $("[name='offers2']").hide();
        }
        $('.cart-is').removeClass('cart_open');
        $('#Pop1').fadeIn();
      });

      $('.pop-close').click(function(e) {
        $('.shade-popup').hide();
      });


	  $('.pop-chkbtn').click(function(e) {
        
        var shade_combo_error = 0;
        if ($("[name='offers']").is(":visible")) {
          if($("[name='offers'] option:selected").val()==""){
            shade_combo_error++;
          }
        }
        if ($("[name='offers1']").is(":visible")) {
          if($("[name='offers1'] option:selected").val()==""){
            shade_combo_error++;
          }
        }
        if ($("[name='offers2']").is(":visible")) {
          if($("[name='offers2'] option:selected").val()==""){
            shade_combo_error++;
          }
        }
        
        if(shade_combo_error==1){
          $('.shade-popup .shade-error').show();
          $('.shade-popup .shade-error').html('Please select shade');
          return false;
        } else if(shade_combo_error>1){
          $('.shade-popup .shade-error').show();
          $('.shade-popup .shade-error').html('Please select all '+shade_combo_error+' shades');
          return false;
        } else {
          $('.shade-popup .shade-error').hide();
          $('.pop-open').removeClass('popopend');
        }
        
        var cur_time = new Date().getTime();
        
        var itemArray = [];
        
        if ($("[name='offers']").is(":visible")) {
          var itemData1 = {
            quantity: 1,
            id: $("[name='offers'] option:selected").val(),
            'properties': {
              '_bundle_id': cur_time
            }
          };
          itemArray.push(itemData1);
        }
        
        if ($("[name='offers1']").is(":visible")) {
          var itemData2 = {
            quantity: 1,
            id: $("[name='offers1'] option:selected").val(),
            'properties': {
              '_bundle_id': cur_time
            }
          };
          itemArray.push(itemData2);
        }
        
        if ($("[name='offers2']").is(":visible")) {
          /* free product */
          var itemData3 = {
            quantity: 1,
            id: $("[name='offers2'] option:selected").val(),
            'properties': {
              '_free_product': 1,
              '_bundle_id': cur_time
            }
          };
          itemArray.push(itemData3);
        }
        
        if($(this).data('bundle-status')==0){
          /* free brush */
          var itemData4 = {
            quantity: 1,
            id: 41473600061670,
            'properties': {
              '_free_brush': 1,
              '_bundle_id': cur_time
            }
          };
          itemArray.push(itemData4);
        }

        
         jQuery.post('/cart/add.js',{items:itemArray});
          
          setTimeout(function() {
          openCartDrawer();
          openCartOverlay();
            fetchCart();
            $( ".pop-close" ).trigger( "click" );
            
            }, 1000);

      });
  
  });