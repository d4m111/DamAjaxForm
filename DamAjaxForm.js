/**
*
* @author Damián Curcio
* @version 3.5 - 22/11/2020
*
* Attributes: df-statuslabel - df-sendmetoo - df-donotclean - df-disablemetoo
*
**/


class DamAjaxForm {
	
	debug							= false
	validationMessage				= "Validation failed"
	statusMessage					= "Processing.. "
	successMessage					= "Successful Operation"
	errorMessage					= "Operation Failed"
	timeout							= 30000		// 0 : no timeout
	checkboxAsObject				= false		// TRUE: devuelve un objeto {value:"valor",checked:"1"};
	checkboxAsVal					= false		// TRUE: el value será 1 si está chequeado o sino 0
	cleanHiddenInput				= false
	setDefaultValueOnClean			= true
	waitToCloseSuccessStatusLabel	= 10000		// 0 : no timeout

    constructor(params = {}){
		if(typeof params !== 'object') throw new Error('Expecting an Object ([Obj])');
		
		if('debug' in params)					this.debug = params.debug
		if('checkboxAsObject' in params)		this.checkboxAsObject = params.checkboxAsObject
		if('checkboxAsVal' in params)			this.checkboxAsVal = params.checkboxAsVal
		if('cleanHiddenInput' in params)		this.cleanHiddenInput = params.cleanHiddenInput
		if('setDefaultValueOnClean' in params)	this.setDefaultValueOnClean = params.setDefaultValueOnClean
		if('validationMessage' in params)		this.validationMessage = params.validationMessage
		if('statusMessage' in params)			this.statusMessage = params.statusMessage
		if('successMessage' in params)			this.successMessage = params.successMessage
		if('errorMessage' in params)			this.errorMessage = params.errorMessage
		if('timeout' in params)					this.timeout = params.timeout

		this.url = ('url' in params) ? params.url : ''
	}
	
	toggleStatusLabel(elementId,action,type = '',message = ''){
		if(!elementId || !action) throw new Error('Expecting at least 2 args (Str, Str [,Str,Str])')

		let element = document.querySelector("#"+elementId+" [df-statuslabel], #"+elementId+"[df-statuslabel]")
		
		let colorTypes = {}

		if(element){
			if(action == "show"){

				switch (type) {
					case 'info': 						
						colorTypes = {
							textColor: '#D4B32C',
							backgroundColor: '#FEFEAD',
							borderColor: '#EDCB41',
							message: ''
						}

						break
					case 'status': 
						colorTypes = {
							textColor: '#D4B32C',
							backgroundColor: '#FEFEAD',
							borderColor: '#EDCB41',
							message: this.statusMessage
						}

						break
					case 'success':
						colorTypes = {
							textColor: '#2A8E1A',
							backgroundColor: '#AFF89D',
							borderColor: '#61C351',
							message: this.successMessage
						}

						break
					case 'validation':
						colorTypes = {
							textColor: '#E55F5F',
							backgroundColor: '#FFC9C9',
							borderColor: '#FC9090',
							message: this.validationMessage
						}

						break
					case 'error':
					default:
						colorTypes = {
							textColor: '#E55F5F',
							backgroundColor: '#FFC9C9',
							borderColor: '#FC9090',
							message: this.errorMessage
						}
				}

				let btnCloser = document.createElement("span");
				btnCloser.innerHTML = ' X '
				btnCloser.style.float = 'right'
				btnCloser.style.marginRight = '2px'
				btnCloser.style.fontWeight = 'bold'
				btnCloser.style.cursor = 'pointer'
				btnCloser.onclick = () => element.style.display = 'none'

				element.style.margin = '2px'
				element.style.padding = '2px'
				element.style.display = 'block'
				element.innerHTML = (message) ? message : colorTypes.message
				btnCloser.style.color = colorTypes.textColor
				element.style.backgroundColor = colorTypes.backgroundColor
				element.style.border = '1px solid '+colorTypes.borderColor
				element.appendChild(btnCloser)

			}else if(action == "hide"){
				element.style.display = 'none'
				element.innerHTML = ''
			}
		}

	}

	toggleFormButtons(formId,action){
		if(!formId || (action != 'enable' && action != 'disable')) throw new Error('Expecting 2 args (Str, Str = enable|disable)');

		let status = (action == 'enable') ? false : true;
		let elements = document.querySelectorAll('#'+formId+' button, #'+formId+' [df-disablemetoo]');
		
		elements.forEach(function(el,ix,ar){
			let tag = el.tagName.toLowerCase();
			let type = el.getAttribute('type');
			let disablemetoo = el.getAttribute('df-disablemetoo');

			if(type == 'submit'){
				if(el.disabled != status){
					el.disabled = status;
				}
			}else if(disablemetoo !== null){
				if(tag == 'button'){
					if(el.disabled != status){
						el.disabled = status;
					}
				}else if(tag == 'a'){
					if(el.style.pointerEvents != 'none'){
						el.style.pointerEvents = 'none';
					}else{
						let styles = el.getAttribute('style');
						el.setAttribute('style',styles.replace('pointer-events: none;', ''));
					}
				}
			}
		},this);
	}

	toggleSendButton(buttonId,action){
		if(!buttonId || (action != 'enable' && action != 'disable')) throw new Error('Expecting 2 args (Str, Str = enable|disable)');

		let status = (action == 'enable') ? false : true;
		let element = document.querySelector('#'+buttonId);

		if(element){
			let tag = element.tagName.toLowerCase();
			let type = element.getAttribute('type');

			if(type == 'submit' || tag == 'button'){
				if(element.disabled != status){
					element.disabled = status;
				}
			}else if(tag == 'a'){
				if(el.style.pointerEvents != 'none'){
					el.style.pointerEvents = 'none';
				}else{
					let styles = el.getAttribute('style');
					el.setAttribute('style',styles.replace('pointer-events: none;', ''));
				}
			}
		}
		
	}
	
	fillForm(formId,data){
		if(!formId || typeof data !== 'object') throw new Error('Expecting 2 args (Str, Obj)');

		let fillObject = (el,value) => { // los elementos son globales
			let tag = el.tagName.toLowerCase();
			let type = el.getAttribute('type');
			let defaultValue = el.getAttribute('value');

			if(value && typeof value === 'object'){						
				if((type == 'checkbox' || type == 'radio')){
					if(parseInt(value.checked) === 1 || value.checked === true || value.checked === 'true'){
						el.checked = true;
					}else{
						el.checked = false;
					}

					if("value" in value){
						el.value = value.value;
						el.setAttribute('df-defaultvalue',defaultValue);
					}
				}
			}else{
				if(tag == 'input' || tag == 'select' || tag == 'textarea'){						
					if(type == 'checkbox'){
						if(parseInt(value) === 1 || value === true || value === 'true'){
							el.checked = true;
						}else{
							el.checked = false;
						}
					}else if(type == 'radio'){
						if(el.value == value){
							el.checked = true;
						}
					}else{
						el.value = value;
					}
				}else if(tag == 'a'){
					el.setAttribute('df-defaultvalue',el.href);
					el.href = value;	
				}else{
					el.innerHTML = value;
				}
			}
		}

		if(data){ // (Array.isArray(data) || array es object
			for(let e in data){
				let value = data[e];
				
				let elements = document.querySelectorAll("#"+formId+" [name='"+e+"']");		// ELEMENT NAME

				if(elements.length == 0){
					elements = document.querySelectorAll("#"+formId+" #"+e);				// ELEMENT ID
				}

				elements.forEach(function(el,ix,ar){
					if(Array.isArray(value)){						
						fillObject(el,value[ix]);	
					}else{
						fillObject(el,value);
					}
				},this);
				
			}
		}

	}
	
	collectForm(formId){
		if(!formId) throw new Error('Expecting 1 arg (Str)');

		let param = {};

		let elements = document.querySelectorAll('#'+formId+' button, #'+formId+' input, #'+formId+' select, #'+formId+' textarea, #'+formId+' a, #'+formId+' [df-sendmetoo]');
		
		elements.forEach(function(el,ix,ar){
			let tag = el.tagName.toLowerCase();
			let id = el.getAttribute('id');
			let name = el.getAttribute('name');
			let type = el.getAttribute('type');
			let href = el.href;
			let value = el.value;
			let sendmetoo = el.getAttribute('df-sendmetoo');
			
			let nameButtonTrigger = (document.activeElement) ? document.activeElement.name : '';
			
			if(tag != 'button' && tag != 'input' && tag != 'select' && tag != 'textarea' && tag != 'a' && sendmetoo !== null && el.textContent){
				
				value = el.textContent;

			}else if(tag == 'a'){ 
				
				if(sendmetoo !== null){
					value = href;
				}else{
					return;
				}

			}else if(type == 'submit'){

				if(nameButtonTrigger && name != nameButtonTrigger){ // si no fue le boton que lanzó el formulario no lo guardo
					return;
				}
			
			}else if(type == 'radio'){ // en la recolección esta bien qu elos radios no sean afectados por checkboxAsVal/checkboxAsObject ya que solo uno puede estar seleccionado
				
				if(el.checked === false){
					return;
				}

			}else if(type == 'checkbox'){	
				
				if(this.checkboxAsVal === true){				
					
					value = (el.checked === true) ? 1 : 0;

				}else if(this.checkboxAsObject === true){	
					let v = {};
					v['checked'] = (el.checked === true) ? 1 : 0;
					v['value'] = value;
					
					value = v;
				}else{
					if(el.checked === false){
						return;
					}
				}

			}
			
			if(name){											// ELEMENT NAME
				let flag_exist_post = false;
				
				for(let k in param){
					let v = param[k];
					
					if(k == name){
						flag_exist_post = true;

						if(Array.isArray(v)){
							param[k].push(value);
						}else{
							param[k] = [];
							param[k].push(v);
							param[k].push(value);
						}
					}
				}
				
				if(flag_exist_post == false){
					param[name] = value;				
				}
			
			}else if(id && !param[id]){							// ELEMENT ID
				param[id] = value;
			}
					
		},this);
		
		return param;
	}

	collectButton(buttonId,attributes = []){
		if(!buttonId || !Array.isArray(attributes)) throw new Error('Expecting at least 1 arg (Str [,Arr])');

		let param = {};
		let element = document.querySelector("#"+buttonId);
		param[ (element.name) ? element.name : buttonId ] = element.value;

		if(element.hasAttributes()){
			for(let attrFromList of attributes){
				for(let attr of element.attributes){

					if(attrFromList == attr.name){
						param[attrFromList] = attr.value;
					}
					
				}
			}
		}

		return param;
	}

	cleanForm(formId){
		if(!formId) throw new Error('Expecting 1 arg (Str)');

		let elements = document.querySelectorAll('#'+formId+' input, #'+formId+' select, #'+formId+' textarea, #'+formId+' a, #'+formId+' [df-sendmetoo]');

		elements.forEach(function(el,ix,ar){
			let tag = el.tagName.toLowerCase();
			let type = el.getAttribute('type');
			let defaultChecked = el.getAttribute('checked');
			let defaultValue = el.getAttribute('value');
			let donotclean = el.getAttribute('df-donotclean');
			let auxDefaultValue = el.getAttribute('df-defaultvalue');

			el.removeAttribute('df-defaultvalue');

			if(donotclean === null){
				if(tag == 'input') {
					if(type == 'radio' || type == 'checkbox'){
						
						el.checked = (this.setDefaultValueOnClean === true && defaultChecked !== null) ? true : false;

						if(auxDefaultValue !== null) defaultValue = auxDefaultValue;

					}else if(this.cleanHiddenInput === false && type == 'hidden'){
						return;																							
					}
				
					el.value = (this.setDefaultValueOnClean === true) ? defaultValue : '';

				}else if(tag == 'textarea'){
					
					el.value = (this.setDefaultValueOnClean === true) ? defaultValue : '';
				
				}else if(tag == 'select'){
					let selIx = 0;

					if(el.options && this.setDefaultValueOnClean === true){
						for(let i = 0; i < el.options.length; i++) {
							let s = el.options[i].getAttribute('selected');
							let v = el.options[i].getAttribute('value');

							el.value = v;

							if(s !== null){
								selIx = i;
								break;
							}
						}
					}

					el.selectedIndex = selIx;
				}else if(tag == 'a'){							
					el.href = (auxDefaultValue !== null) ? auxDefaultValue : '';
				}else{
					el.innerHTML = '';
				}
			}
		},this);
		
	}

	convertParamsToSend(params){
		if(typeof params !== 'object') throw new Error('Expecting 1 arg (Obj)');

		let formData = new URLSearchParams();

		for(let e in params){ // array is object
			let p = params[e];

			if(Array.isArray(p)){
				for(let e2 in p){
					let p2 = p[e2];

					if(p2 && typeof p2 === 'object'){ // si es ojecto o array lo parseo por no poder subir otro nivel
						p2 = JSON.stringify(p2);
					}

					formData.append(e+'[]',p2);
				}
			}else{
				if(p && typeof p === 'object'){ // si es ojecto o array lo parseo por no poder subir otro nivel
					p = JSON.stringify(p);
				}

				formData.append(e,p);
			}
			
		}

		return formData;
	}

	ajaxPromise(params){ // los parametros en GET van en la URL
		if(typeof params !== 'object') throw new Error('Expecting 1 arg (Obj)');

		return new Promise((resolve, reject) => {
			params.url = ('url' in params) ? params.url : this.url;
			params.async = (typeof params.async === 'boolean') ? params.async : true;
			params.method = (params.method) ? params.method : "GET";
			params.timeout = (!isNaN(params.timeout)) ? params.timeout : this.timeout;

			let formData = (params.paramJson === true) ? JSON.stringify(params.params) : this.convertParamsToSend(params.params);

			if(params.paramJson !== true && params.method.toUpperCase() != 'POST' && formData){
				params.url = params.url+'?'+formData.toString();
			}

			if(this.debug === true){
				console.log("Parameters -> ",{url: params.url, method: params.method, params: params.params});
			}

			let xhr = new XMLHttpRequest();
			
			xhr.open(params.method, params.url, params.async);

			if((typeof params.basicAuth === 'object' && 'user' in params.basicAuth && 'password' in params.basicAuth)){
				xhr.setRequestHeader('Authorization','Basic '+btoa(`${params.basicAuth.user}:${params.basicAuth.password}`))
			}

			if(params.responseParseJson === true){
				xhr.setRequestHeader('Content-Type','application/json') // si se definió otro contentType, este va a ser pisado
			}

			if(params && typeof params.requestHeader === 'object' && params.requestHeader){
				if(Array.isArray(params.requestHeader)){
					for(let k in params.requestHeader){
						let v = params.requestHeader[k];

						if(typeof v === 'object' && v){
							xhr.setRequestHeader(Object.keys(v)[0], v[Object.keys(v)[0]]);
						}
					}
				}
			}
			
			if(params.mimeType){ // text/plain text/html image/jpeg image/pngaudio/mpeg audio/ogg audio/* video/mp4 application/octet-stream
				xhr.overrideMimeType(params.mimeType);
			}

			if(params.responseType){ // text arraybuffer blob document (is an HTML or XML Document) ms-stream
				xhr.responseType = params.responseType;
			}
			
			xhr.onreadystatechange = () => {
				if(xhr.readyState == 4){
										
					let response = xhr.response;

					if(params.responseParseJson === true){
						if(response && (response.trim().charAt(0) == "{" || response.trim().charAt(0) == "[")){
							response = JSON.parse(response);
						}		
					}

					if(this.debug === true){
						console.log("Response -> "+xhr.status+" > "+xhr.statusText+" > ",response);
					}

					let data = {
						response,
						'statusType': (xhr.status < 300) ? 'success' : 'error',
						'statusCode': xhr.status,
						'statusText': xhr.statusText
					}

					// if(xhr.status < 300){
					// 	resolve(data);
					// }else{
					// 	reject(data);
					// }

					resolve(data);
				}
			};

			if(!isNaN(params.timeout) && params.timeout >= 0){
				xhr.timeout = params.timeout;
			}

			xhr.send(formData);
		});
	}
	
	ajaxCall(params){
		if(typeof params !== 'object') throw new Error('Expecting 1 arg (Obj)')

		this.ajaxPromise(
			params
		).then((data) => {
			if(typeof params.callback == "function"){
				params.callback(data.response,data.statusType,data.statusCode,data.statusText)
			}
		})
		
	}
	
	sendForm(formId,params = {}){
		if(!formId || typeof params !== 'object') throw new Error('Expecting at least 1 arg (Str [,Obj])')

		// en este metodo no importa si exite el form. el ajax se manda igual.

		let element = document.querySelector('#'+formId)
		
		let formMethod = (element) ? element.getAttribute('method') : ''
		let formAction = (element) ? element.getAttribute('action') : ''
		
		let url = ('url' in params) ? params.url : this.url
		url = ('endpoint' in params) ? url+params.endpoint : ((formAction) ? formAction : url)
		
		let method = ('method' in params) ? params.method : ((formMethod) ? formMethod : 'POST')
		let basicAuth = ('basicAuth' in params) ? params.basicAuth : null
		let requestHeader = ('requestHeader' in params) ? params.requestHeader : null
		let paramsTosend = ('params' in params) ? params.params : this.collectForm(formId)
		let timeout = params.timeout
		let preCheckResponse = true
		let backCheckResponse = {}

		if(typeof params.preCall == "function"){
			preCheckResponse = params.preCall(paramsTosend)
			
			if(preCheckResponse !== true){					
				this.toggleStatusLabel(formId,"show",'validation',preCheckResponse)
			}	
		}

		if(preCheckResponse === true){
			this.toggleStatusLabel(formId,'show','status')
			this.toggleFormButtons(formId,'disable')

			this.ajaxPromise({
				url,
				method,
				basicAuth,
				requestHeader,
				responseParseJson: true,
				params: paramsTosend,
				timeout,
			}).then((data) => {					
				
				this.toggleStatusLabel(formId,'hide')
				this.toggleFormButtons(formId,'enable')

				if(typeof params.callback == "function"){
					backCheckResponse = params.callback(data.response,data.statusType,data.statusCode,data.statusText)
				}

				// si se devuelve un obj con el es param break:breack, no hace nada
				let statusBreak	= (typeof backCheckResponse === 'object' && 'break' in backCheckResponse) ? backCheckResponse.break : ''
				let statusType	= (typeof backCheckResponse === 'object' && 'statusType' in backCheckResponse) ? backCheckResponse.statusType : data.statusType
				let statusText	= (typeof backCheckResponse === 'object' && 'statusText' in backCheckResponse) ? backCheckResponse.statusText : ''
				
				if(statusBreak.toLowerCase() != 'break'){

					this.toggleStatusLabel(formId,'show',statusType,statusText)

					if(statusText != 'error'){
						this.cleanForm(formId)
					}

					if(statusType == 'success' && !isNaN(this.waitToCloseSuccessStatusLabel) && this.waitToCloseSuccessStatusLabel > 0){
						
						setTimeout(() => {
							this.toggleStatusLabel(formId,'hide')
							
							if(typeof params.finalCallback == "function"){
								params.finalCallback(data.response,data.statusType,data.statusCode,data.statusText)
							}
						}, this.waitToCloseSuccessStatusLabel)
					}else{
						if(typeof params.finalCallback == "function"){
							params.finalCallback(data.response,data.statusType,data.statusCode,data.statusText)
						}
					}
				}

			})
		}
		
	}

	sendFormOnSubmit(formId,params = {}){
		document.getElementById(formId).addEventListener("submit", (e) => {
			e.preventDefault();
			
			this.sendForm(formId,params);
		});
	}

	sendButton(buttonId,params = {}){	// en este metodo no importa si exite el boton. el ajax se manda igual
		if(!buttonId || typeof params !== 'object') throw new Error('Expecting at least 1 arg')

		let element = document.querySelector("#"+buttonId);
			
		let url = ('url' in params) ? params.url : this.url
		url = ('endpoint' in params) ? url+params.endpoint : url

		let method = ('method' in params) ? params.method : 'POST'
		let basicAuth = ('basicAuth' in params) ? params.basicAuth : null
		let requestHeader = ('requestHeader' in params) ? params.requestHeader : ''
		let attributes = ('attributes' in params) ? params.attributes : []
		let paramsTosend = ('params' in params && params.params) ? params.params : {}
		let statusLabelId = ('statusLabelId' in params) ? params.statusLabelId : ''
		let timeout = params.timeout
		let preCheckResponse = true
		let backCheckResponse = {}

		paramsTosend = Object.assign({}, paramsTosend, this.collectButton(buttonId,attributes))

		if(typeof params.preCall == "function"){
			preCheckResponse = params.preCall(paramsTosend)
			
			if(preCheckResponse !== true){
				if(statusLabelId){
					this.toggleStatusLabel(statusLabelId,'show','validation',preCheckResponse)
				}else{
					alert((preCheckResponse) ? preCheckResponse : this.validationMessage)
				}
			}	
		}

		if(preCheckResponse === true){
			if(statusLabelId){
				this.toggleStatusLabel(statusLabelId,'show','status')
			}
			
			this.toggleSendButton(buttonId,'disable')
			
			this.ajaxPromise({
				url,
				method,
				basicAuth,
				requestHeader,
				responseParseJson: true,
				params: paramsTosend,
				timeout,
			}).then((data) => {
				
				if(statusLabelId){
					this.toggleStatusLabel(statusLabelId,"hide")
				}

				this.toggleSendButton(buttonId,'enable')

				if(typeof params.callback == "function"){
					backCheckResponse = params.callback(data.response,data.statusType,data.statusCode,data.statusText);
				}

				// si se devuelve un obj con el es param break:breack, no hace nada
				let statusBreak	= (typeof backCheckResponse === 'object' && 'break' in backCheckResponse) ? backCheckResponse.break : ''
				let statusType	= (typeof backCheckResponse === 'object' && 'statusType' in backCheckResponse) ? backCheckResponse.statusType : data.statusType
				let statusText	= (typeof backCheckResponse === 'object' && 'statusText' in backCheckResponse) ? backCheckResponse.statusText : ''

				if(statusBreak.toLowerCase() != 'break'){
					if(statusLabelId){
						this.toggleStatusLabel(statusLabelId,'show',statusType,statusText)
					}

					if(statusType == 'success' && !isNaN(this.waitToCloseSuccessStatusLabel) && this.waitToCloseSuccessStatusLabel > 0){
						setTimeout(() => {
							if(statusLabelId){
								this.toggleStatusLabel(statusLabelId,'hide')
							}
							
							if(typeof params.finalCallback == "function"){
								params.finalCallback(data.response,data.statusType,data.statusCode,data.statusText)
							}
						}, this.waitToCloseSuccessStatusLabel)
					}else{
						if(typeof params.finalCallback == "function"){
							params.finalCallback(data.response,data.statusType,data.statusCode,data.statusText)
						}
					}
				}
			})
		}
		
	}

	sendButtonOnClick(buttonId,params = {}){
		document.getElementById(buttonId).addEventListener("click", (e) => {
			e.preventDefault();

			this.sendButton(buttonId,params);
		});
	}

	sendButtonOnChange(buttonId,params = {}){
		document.getElementById(buttonId).addEventListener("change", (e) => {
			e.preventDefault();

			this.sendButton(buttonId,params);
		});
	}

}
