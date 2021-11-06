import API from "./api.js";
import { getIdCompany } from "../helpers.js";

export const isLoggedIn = async () => {
	try{
		const TOKEN = localStorage.getItem('@masterpizza-delivery-app/token');
		const response = await API.post("clientLogged", {  
			id: localStorage.getItem('@masterpizza-delivery-app/id_client'),
			idCompany: getIdCompany()
		},{
			headers: { Authorization: 'Bearer '.concat(TOKEN) }
		});
		if(response.status === 200){
			localStorage.setItem('@masterpizza-delivery-app/name-phone-user', `${response.data[0].name_client};${response.data[0].phone_client}`);
			return true;
		}else{
			return false;
		}
	} catch(error){
		return false;
	}	
}
