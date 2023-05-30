let session_cookie = convert.getCookie('_conv_s')
if (
  (JSON.stringify(convert.currentData.experiments) != '{}' ||
    JSON.stringify(convert.historicalData.experiments) != '{}') &&
  session_cookie
) {
  // Create a goal and change the id below
  let revenue_goal_id = ''

  let session_id = session_cookie.substring(
    session_cookie.lastIndexOf('sh:') + 3,
    session_cookie.lastIndexOf('*')
  )

  let exp_list = []
  let variation_list = []

  let varID
  if (convert.currentData) {
    let new_exp = convert.currentData.experiments
    for (let expID in new_exp) {
      varID = new_exp[expID].variation_id
      if (!exp_list.includes(convert.data.experiments[expID].id)) {
        exp_list.push(convert.data.experiments[expID].id)
        variation_list.push(varID)
        console.debug(
          'Adding experiment: ' +
            convert.data.experiments[expID].id +
            ':' +
            varID
        )
      }
    }
  }
  if (convert.historicalData) {
    let old_exp = convert.historicalData.experiments
    for (let expID in old_exp) {
      varID = old_exp[expID].variation_id
      if (!exp_list.includes(convert.data.experiments[expID].id)) {
        exp_list.push(convert.data.experiments[expID].id)
        variation_list.push(varID)
        console.debug(
          'Adding experiment: ' +
            convert.data.experiments[expID].id +
            ':' +
            varID
        )
      }
    }
  }

  let convert_attributes = {
    cid: convert.data.u_id,
    pid: convert.data.prj.id,
    vid: session_id,
    goals: revenue_goal_id,
    vars: variation_list,
    exps: exp_list,
    defaultSegments: convert.getDefaultSegments()
  }

  localStorage.setItem('convert_attributes', JSON.stringify(convert_attributes))
}
