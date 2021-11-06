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
		v = v.replace(/\D/g,"");
    	v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
    	v = v.replace(/(\d)(\d{4})$/,"$1-$2");
	}
    return v;
}

export function getIdCompany(){
	const ID_COMPANY = "b0ef909f-eb7d-4e1b-890b-96de0d00789e"; //ID-TESTE-COMPANY-NATAN
	return ID_COMPANY;
}

