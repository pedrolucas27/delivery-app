import API from "./api.js";
import { getIdCompany } from "../helpers.js";

export const isLoggedIn = async (ID_COMPANY) => {
	try{
		const ID_COMPANY = getIdCompany();
		const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client');
		const tokenClient = localStorage.getItem('@masterpizza-delivery-app/token');
		const response = await API.post("clientLogged", {  
			id: idClient,
			idCompany: ID_COMPANY
		},{
			headers: { Authorization: 'Bearer '.concat(tokenClient) }
		});

		if(response.status === 200){
			return true;
		}else{
			return false;
		}

	} catch(error){
		return false;
	}	
}
