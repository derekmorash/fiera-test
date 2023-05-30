var varDataItem = JSON.parse(localStorage.getItem("buy3dataitem"));

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      //var varDataItem = JSON.parse(localStorage.getItem("buy3dataitem"));


      const quantity = Array.from(this.querySelectorAll('[name="updates[]"]')).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

      //console.log(quantity);
      //console.log(this.dataset);
      // console.log(this.dataset.bundle);
      var updateData = [];
      var product_all = [];
      var data = [];
      //console.log($('tr[data-cart-bundle-id="'+this.dataset.bundle+'"]'));
      $('tr[data-cart-bundle-id="'+this.dataset.bundle+'"]').each(function(k,v){
        // console.log($(v).attr('data-var-id'));
        if($(v).attr('data-var-id') != undefined && $(v).attr('data-cart-bundle-id')!= 0){
          var id = $(v).attr('data-var-id');

          product_all.push(id);

          updateData.push({'id':id, 'quantity':0});
        }
      });

      //console.log(updateData);
      //console.log(product_all.length);
      var l = product_all.length;
      l =  l-1;
      if(product_all.length > 0){
        //console.log('hii');
        /*jQuery.post('/cart/update.js', {
        updates: updateData
      }).done(function(result){
        console.log(result);
      });*/

        $(updateData).each(function(k,v){
          //console.log(v);
          setTimeout(function(){

            $.ajax({
              url: "/cart/change.js",
              async:false,
              type: "POST",
              dataType:'json',
              data: v,
              success:function(response){
                console.log(response);
                console.log(k);
                console.log(l);
                if(k == l){
                  location.reload();
                }
              }
            });

            /*fetch('/cart/change.js', {
              body: JSON.stringify(v),
              credentials: 'same-origin',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
              }
            }).then(function (cart) {
              cart.json().then(function (content) {
                console.log(content);
                //_this30.itemCount = content['item_count'];
                //_this30._rerenderCart(elementToAnimate);
                //console.log(cart);
                if(k == l){
                  //location.reload();
                }
              });
            });*/
          }, 500);
        });
        //this.closest('cart-items').updateQuantity(this.dataset.index, 0);



      }else{
        this.closest('cart-items').updateQuantity(this.dataset.index, 0);
      }

      //this.closest('cart-items').updateQuantity(this.dataset.index, 0);

      /*fetch('/cart/update.js', {
        body: JSON.stringify({'updates': updateData}),
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
        }
      }).then(function (cart) {
        cart.json().then(function (content) {
          //_this30.itemCount = content['item_count'];
          //_this30._rerenderCart(elementToAnimate);
			//console.log(cart);
          document.dispatchEvent(new CustomEvent('theme:loading:end'));
        });
      });*/


      /*const DataItemId =  $(this).parent().closest('.cart-item').attr('data-var-id');

       const cartItems =  this.closest('cart-items');

      if(jQuery.inArray(DataItemId, varDataItem) != -1) {

             var datalength = varDataItem.length;

             for (let j = 0; j < datalength; j++) {

               if(j == 0){
               setTimeout(function() {
                  var dataLine = $('.cart-item[data-var-id="'+varDataItem[j]+'"]').attr('data-line-index');


                  cartItems.updateQuantity(dataLine ,0);


               }, 1000);
               }

               if(j == 1){
               setTimeout(function() {
                  var dataLine = $('.cart-item[data-var-id="'+varDataItem[j]+'"]').attr('data-line-index');


                 cartItems.updateQuantity(dataLine ,0);

               }, 2000);
               }

               if(j == 2){
               setTimeout(function() {
                  var dataLine = $('.cart-item[data-var-id="'+varDataItem[j]+'"]').attr('data-line-index');


                 cartItems.updateQuantity(dataLine ,0);

               }, 3000);
               }

             }



           } else {

               $('[data-cart-bundle-id="'+this.dataset.bundle+'"]').each(function(){
               if($(this).attr('data-free-product-status') == 0){
       //           console.log($(this).attr('data-line-index'));

                 this.closest('cart-items').updateQuantity($(this).attr('data-line-index'), 0);
                 //setTimeout(function(){
                   //this.closest('cart-items').updateQuantity($(this).attr('data-line-index'), 0);
                 //},1000);
               }
               //console.log($(this).attr('data-line-index'));
               //updateData[$(this).attr('data-line-index')] = quantity;
             });
             //return false;

                this.closest('cart-items').updateQuantity(this.dataset.index, 0);
           }*/
//       console.log(this.dataset.index);
//       
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();

    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
        .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      }
    ];
  }

  updateQuantity(line, quantity, name) {


    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

//     console.log(body);

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
        .then((response) => {
          console.log('response');
          return response.text();
        })
        .then((state) => {
          //console.log('test2');
          const parsedState = JSON.parse(state);
          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartFooter = document.getElementById('main-cart-footer');

          if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);

          this.getSectionsToRender().forEach((section => {
            const elementToReplace =
                document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            //console.log(parsedState);
            if(parsedState.sections[section.section] != undefined){
              var t = parsedState.total_price;
              t = t/100;
              $('.totals__subtotal-value').text('$ '+ t.toFixed(2) + ' USD');

//             console.log(parsedState.sections[section.section]);
//             console.log(section.selector);

//             console.log(parsedState.item_count);
              //var cart_count = $('.lblCartCount').text();
              //console.log(cart_count);
              $('.lblCartCount').text(parsedState.item_count);
            }

            // KL: Only update if we had values
            if ((parsedState.sections[section.section] != null)) {
              elementToReplace.innerHTML =
                  this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            }

          }));

          this.updateLiveRegions(line, parsedState.item_count);
          const lineItem =  document.getElementById(`CartItem-${line}`);
          if (lineItem) {
            // KL: Only update if we had values
            if (name != null) {
              lineItem.querySelector(`[name="${name}"]`).focus();
            }
          }
          this.disableLoading();
        }).catch((error) => {
      this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
      document.getElementById('cart-errors').textContent = window.cartStrings.error;
      this.disableLoading();
    });
  }

  updateLiveRegions(line, itemCount) {
    /*if (this.currentItemCount === itemCount) {
      document.getElementById(`Line-item-error-${line}`)
          .querySelector('.cart-item__error-text')
          .innerHTML = window.cartStrings.quantityError.replace(
          '[quantity]',
          document.getElementById(`Quantity-${line}`).value
      );
    }*/

    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    document.getElementById('main-cart-items').classList.add('cart__items--disabled');
    this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading() {
    document.getElementById('main-cart-items').classList.remove('cart__items--disabled');
  }
}

customElements.define('cart-items', CartItems);

$( ".cart-item" ).each(function( index ){
  var DataVarId = $(this).attr('data-var-id');

  console.log(DataVarId);

  if(jQuery.inArray(DataVarId, varDataItem) != -1) {
    $(this).find('.quantity').hide();

  }

});

