# DamAjaxForm
pure javascript form sender

frontend.html
--------------------------------------------------------------------------------------------------------------

<!DOCTYPE html>
<html>
<head>
</head>
<body>

	<form id="form-identifier">
    <!-- action="backend.php" method="POST" / you can set the action and method that will be used -->
        <!-- here will be shown the status label -->
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
	<th>
	<button class="btn btn-success" id="button-identifier" value="button-1" param-1="param-1">button</button>
</body>

<script>

document.addEventListener('DOMContentLoaded', (e) => {
    
    let fm = new DamAjaxForm({
		
		// debug: true,
		url: 'backend.php',
		// checkboxAsObject: true,
		// setDefaultValueOnClean: false,
		// closeModalOnSubmit: false,
		// showSuccessLabel: false,
		// reloadGrid: (element,statusType) => console.log('-- RELOAD GRID GLOBAL--')
		// toggleModal: (element,statusType,action) => console.log('-- TOGGLE MODAL GLOBAL --'),
	});

    // fills elements inside form
	fm.fillForm('form-identifier',{
		'input-name':'fill-input-name',
		'input-id':'fill-input-id',
		'same-name':['fill-same-name-1','fill-same-name-2']
	});

    // when the submit button is clicked
    // 1. appears status label
    // 2. the submit button is disabled
    // 3. inputs are cleaned
    // 4. disappears status label
	fm.sendFormOnSubmit('form-identifier',{
		method: 'PUT',
        // url: 'backend.php',
		// endpoint: '/user',
		// preCall: data => {console.log('Precall -> ',data); return false;}, // puede devolver el texto de error
		// reloadGrid: (element,statusType) => console.log('-- RELOAD GRID LOCAL --'),
		// toggleModal: (element,statusType,action) => console.log('-- TOGGLE MODAL LOCAL --'),
		callback: (data,statusType,statusCode,statusText) => {
			console.log('form response: ',data,statusType,statusCode,statusText)
			// return {statusType:'info',statusText:'custom error'}
			// return {break:'break'}
		}
	})
    
    // when the button is clicked
    fm.sendButtonOnClick('button-identifier',data = {
		'statusLabelId': 'label-id',
		'attributes': ['param-1'],
		// preCall: data => {console.log('Precall -> ',data); return false;}, // puede devolver el texto de error
		// reloadGrid: (element,statusType) => console.log('-- RELOAD GRID LOCAL --'),
		// toggleModal: (element,statusType,action) => console.log('-- TOGGLE MODAL LOCAL --'),
		callback: (data,statusType,statusCode,statusText) => {
			console.log('button response: ',data,statusType,statusCode,statusText)
			// return {statusType:'info',statusText:'custom error'}
			// return {break:'break'}
		}
	})

	// fm.sendButtonOnChange('checkList',data = {})

})

</script>


backend.php
--------------------------------------------------------------------------------------------------------------

<?php

$r = $_POST['input-name']        // value-input-name
$r = $_POST['input-id']          // value-input-id
$r = $_POST['same-name']         // [0 => value-same-name-1', 1 => 'value-same-name-2']
$r = $_POST['list-name']         // selected-option-2
$r = $_POST['label-name']        // label
$r = $_POST['check-name']        // value-checked
$r = $_POST['radio-name']        // value-radio-2
$r = $_POST['textarea-name']     // textarea