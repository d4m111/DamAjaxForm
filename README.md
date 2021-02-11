# DamAjaxForm
pure javascript form sender

    let fm = new DamAjaxForm();

    // it sets values inside form

	fm.fillForm('form-identifier',{
		'input-name':'value-input-name',
		'input-id':'value-input-id',
		'same-name':['value-same-name-1','value-same-name-2']
	});

    // when the submit button is clicked

    // 1. status label appears
    // 2. submit buttons are disabled
	// 3. form sends data
    // 5. inputs are cleaned
    // 6. status label disappears

	fm.sendFormOnSubmit('form-identifier',{
		// method: 'PUT',                   // if you don't set the method it will be take from <form method="POST">
        // url: 'backend.php',              // if you don't set the url it will be take from <form action="backend.php">
		preCall: data => {					// it can be used to validate
			// return true	 				// form is sent
			return false	 				// form is not sent
			// return 'an error message'	// form is not sent and it shows an error message
		},
		callback: (data,statusType,statusCode,statusText) => {
			// return {statusType:'error',statusText:'custom error'} // you can set massage in the status label
			// return {break:'break'}		// you can stop here. the status label success/error don be shown and form will not be cleaned
		}
	})
    