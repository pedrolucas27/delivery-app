export function maskMoney(value) {
	var v = value;
	if (value) {
		v = String(value).replace(/\D/g, '');
		v = (v / 100).toFixed(2) + '';
		v = v.replace(".", ",");
		v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
		v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	}
	return v;
}

export function changeCommaForPoint(value) {
	var v = value;
	if (value) {
		v = value.toFixed(2);
		v = String(v).replace(".", ",");
	}
	return v;
}

export function maskPhoneCell(value) {
	var v = value;
	if (value) {
		v = v.replace(/\D/g, "");
		v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
		v = v.replace(/(\d)(\d{4})$/, "$1-$2");
	}
	return v;
}

export function getIdCompany() {
	const ID_COMPANY = "dd63645d-8b03-4c7b-9534-14cf60e025cc"; //ID-TESTE-COMPANY-NATAN
	return ID_COMPANY;
}

export function generateLinkRecoverPassword(phone){
	const link = `https://api.whatsapp.com/send?phone=55${phone}&text=Ol%C3%A1%2C%20atendimento%20do%20Master%20Pizza.%20Gostaria%20de%20alterar%20minha%20senha%20de%20usua%C5%95io%20para%20acessar%20o%20aplicativo.`;
	return link;
}