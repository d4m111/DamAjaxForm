# DamAjaxForm
pure javascript form sender

frontend.html
--------------------------------------------------------------------------------------------------------------

	<!-- you can set the action and method that will be used -->
	<form id="form-identifier" action="backend.php" method="POST">
		
		<!-- the status label will be shown here -->
		<div df-statusLabel></div>
		<input type="text" name="input-name" value="value-input-name">
		<input type="text" id="input-id" value="value-input-id">
		<input type="text" name="same-name" value="value-same-name-1">
		<input type="text" name="same-name" value="value-same-name-2">
		<select name="list-name" id="checkList">
			<option value="list-option-1">nonselected-option-1</option>
			<option value="list-option-2" selected>selected-option-2</option>
		</select>
		
		<!--this tag will be sent too -->
		<p name="label-name" df-sendmetoo>label</p>
		<input type="checkbox" name="check-name" value="value-checked" checked>
		<input type="radio" name="radio-name" value="value-radio-1"> radio-1
		<input type="radio" name="radio-name" value="value-radio-2" checked> radio-2
		
		<!--this tag will be disabled too. Like a submit button -->
		
		<a name="link-name" href="https://www.google.com/" df-disablemetoo>link</a>
		<textarea name="textarea-name">textarea</textarea>
		<button type="submit" name="button-name-1" value="submited-button-1">button-1</button>
		<button type="submit" name="button-name-2" value="nonsubmited-button-2">button-2</button>
	</form>
	<div id="label-id" df-statusLabel></div>
	
	<button id="button-identifier" param-1="value-param-1">button</button>

frontend.js
--------------------------------------------------------------------------------------------------------------

    let fm = new DamAjaxForm({
		// debug: true,
		// url: 'backend.php',				// you can also set the url here
		// checkboxAsObject: true,			// checkboxes will be sent as an object {'checked':1,'value':data}
		// showSuccessLabel: false,			// when the form is sent successfuly. it will show the success label 
	});

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
		// method: 'PUT',
        // url: 'backend.php',
		// endpoint: '/endpoint',			// backend.php/endpoint
		preCall: data => {					// it can be used to validate
			// return true	 				// form is sent
			return false	 				// form is not sent
			// return 'an error message'	// form is not sent and shows an error message
		},
		callback: (data,statusType,statusCode,statusText) => {
			// return {statusType:'error',statusText:'custom error'} // you can set massage in the status label
			// return {break:'break'}
		},
		toggleModal: (element,statusType,action) => {
			// if callback() returns statusType:'error', toggleModal() will not be called
			// if callback() returns break:'break', toggleModal() will not be called
			// If you have the form inside a modal. you could put the code to close it
		}
	})
    
    // when the button is clicked

    fm.sendButtonOnClick('button-identifier',data = {
		'statusLabelId': 'label-id',
		'attributes': ['param-1'],		// the atribute 'param-1' will be sent as a param <button id="id" param-1="value">..
		// preCall: data => { return false },
		// callback: (data,statusType,statusCode,statusText) => {}
		// toggleModal: (element,statusType,action) => {}
	})

	// when the element is changed

	// fm.sendButtonOnChange('element-identifier',data = {
		// same parameters as sendButtonOnClick()
	})
	
	// You can make ajax calls 

	fm.ajaxCall({
		url: "backend.php",
		method : "POST",
		// async: false,
		// timeout: 50,
		// paramJson: true,					// send params as json
		// responseParseJson: true,			// parse response as json
		params: {"name-1":"value-1"},
		requestHeader: [
			{'Authorization': 'Basic '+btoa('my_user'+':'+'my_pass')}, // authentication
			{'Content-type':'application/x-www-form-urlencoded'}
		],
		callback: (data,statusType,statusCode,statusText) => {}
	});
	

backend.php
--------------------------------------------------------------------------------------------------------------

	$r = $_POST['input-name']        // value-input-name

	$r = $_POST['input-id']          // value-input-id

	$r = $_POST['same-name']         // [0 => value-same-name-1', 1 => 'value-same-name-2']

	$r = $_POST['list-name']         // selected-option-2

	$r = $_POST['label-name']        // label

	$r = $_POST['check-name']        // value-checked

	$r = $_POST['radio-name']        // value-radio-2

	$r = $_POST['textarea-name']     // textarea