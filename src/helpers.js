export function maskMoney(value){
	var v = value;
	if(value){
		v = String(value).replace(/\D/g,'');
		v = (v/100).toFixed(2) + '';
		v = v.replace(".", ",");
		v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
		v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	}
	return v;
}

export function changeCommaForPoint(value){
	var v = value;
	if(value){
		v = value.toFixed(2);
		v = String(v).replace(".", ",");
	}
	return v;
}

export function maskPhoneCell(value){
	var v = value;
	if(value){
		v = v.replace(/\D/g,""); //Remove tudo o que não é dígito
    	v = v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    	v = v.replace(/(\d)(\d{4})$/,"$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
	}
    return v;
}

export function getIdCompany(){
	const ID_COMPANY = "e7814c8f-36bb-456e-9f46-18337dadeacf";
	return ID_COMPANY;
}

