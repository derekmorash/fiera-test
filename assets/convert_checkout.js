// adding the convert script to head
if (typeof _conv_host == 'undefined') {
  window['_conv_prevent_bodyhide'] = true
  window['_conv_page_type'] = 'order_confirmation'

  let _conv_track = document.createElement('script')
  _conv_track.src = '//cdn-3.convertexperiments.com/js/10007438-10006779.js'

  document.getElementsByTagName('head')[0].appendChild(_conv_track)
}

const currency_to_report = 'USD'

// doing logic to submit track conversions
if (
  Shopify?.Checkout?.page === 'thank_you' &&
  Shopify?.Checkout?.step === 'thank_you'
) {
  console.debug('Convert: We are on the thank you page')

  var convert_attributes = JSON.parse(
    localStorage.getItem('convert_attributes')
  )

  fetch('https://cdn.shopify.com/s/javascripts/currencies.js').then(
    (response) => {
      response.text().then((currencies_code) => {
        eval(currencies_code)

        console.debug('Convert: Multicurrency method')

        if (convert_attributes) {
          console.debug('Convert: We have attributes')
          console.debug(convert_attributes)

          //build POST data to be sent
          const post = {
            cid: convert_attributes.cid,
            pid: convert_attributes.pid,
            seg: convert_attributes.defaultSegments,
            s: 'shopify',
            vid: convert_attributes.vid,
            ev: [
              {
                evt: 'tr',
                goals: [convert_attributes.goals],
                exps: convert_attributes.exps,
                vars: convert_attributes.vars,
                r: parseFloat(
                  Currency.convert(
                    Shopify?.checkout?.total_price,
                    Shopify?.checkout?.currency,
                    currency_to_report
                  )
                ),
                prc: Shopify?.checkout?.line_items.length
              },
              {
                evt: 'hitGoal',
                goals: [convert_attributes.goals],
                exps: convert_attributes.exps,
                vars: convert_attributes.vars
              }
            ]
          }

          const data = JSON.stringify(post)
          console.debug(post)

          fetch(
            `https://${convert_attributes.pid}.metrics.convertexperiments.com/track`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
              },
              body: data
            }
          )
            .then((response) => response.json())
            .then((_) => {
              console.debug('Convert: Conversion registered')
            })
            .catch(function (error) {
              console.error(error)
            })
        }
      })
    }
  )
} else {
  console.debug('Convert: We are not on the thank you page')
}
