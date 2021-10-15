import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { changeCommaForPoint, getIdCompany } from "../../helpers.js";
import API from "../../server/api.js";
import "../../index.css";
const ModalAddressClient = (props) => {
	const ID_COMPANY = getIdCompany();
	
	const [formData, setFormData] = useState({
		street: '',
		number_address: '',
		district: '',
		form_payment: '',
		observation: ''
	});
	const [dataFormPayment, setDataFormPayment] = useState([]);
	const [valueDiscount, setValueDiscount] = useState(0);
	const [nameCoupom, setNameCoupom] = useState(null);
	const [coupom, setCoupom] = useState(null);
	const [idFormPayment, setIdFormPayment] = useState("-1");
	const alert = useAlert();

	useEffect(() => {
		API.get("form_payment/actives/"+ID_COMPANY).then((response) => {
			let array = [];
			console.log(response.data);
			response.data.forEach((formPayment) => {
				array.push({
					label: formPayment.name_form_payment,
					value: formPayment.id,
				})
			})
			setDataFormPayment(array);						
		}).catch((error) => {
			console.log('Erro na listagem das formas de pagamento!');
		});
	}, []);

	const getCoupomChangeName = async (e) => {
		if(nameCoupom){
			API.get("coupom/"+nameCoupom+"/"+ID_COMPANY).then((response) => {
				if(response.status === 200){
					if(response.data){
						setCoupom(response.data[0]);
						setValueDiscount(response.data[0].value_discount)
					}
				}
			}).catch((error) => {
				alert.error("Erro de comunicação com o servidor ao tentar buscar cupom.");
			});
		}else{
			alert.error("Informe um cupom válido para poder aplicar!");
		}
		e.preventDefault();
	}

	const onChangeForm = (e) => {
		var data = {
			street: formData.street,
			number_address: formData.number_address,
			district: formData.district,
			form_payment: formData.form_payment,
			observation: formData.observation
		}
		data[e.target.name] = e.target.value;
		setFormData(data);
	}

	const submitData = () => {
		if(formData.street && formData.number_address && formData.district){
			if(idFormPayment !== "-1"){
				var json = {
					street: formData.street,
					number_address: formData.number_address,
					district: formData.district,
					form_payment: idFormPayment,
					coupom: coupom,
					observation: formData.observation,
					valueDiscount: valueDiscount
				}
				props.onFinishOrder(json);
			}else{
				alert.error("Escolha uma forma de pagamento.");
			}
		}else{
			alert.error("Preencha todos os campos referente ao endereço.");
		}
	}

	const changeFormPayment = (e) => {
		console.log(e.target.value);
		let formPayment = dataFormPayment.filter((form) => form.label === e.target.value);
		if(formPayment.length !== 0){
			console.log(formPayment[0].value);
			setIdFormPayment(formPayment[0].value);
		}else{
			setIdFormPayment("-1");
		}
		
	}

	return(
		<div className={
			props.show ? 
				"overflow-y-visible overflow-x-hidden fixed w-full h-full top-0 left-0 flex items-center justify-center"
			:
				"modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center"
		}>
    		<div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
    
		    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
		      
		      <div 
		      	className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
		      	onClick={() => props.close()}
		      >
		        <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
		          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
		        </svg>
		        <span className="text-sm">(Esc)</span>
		      </div>

		      <div className="modal-content py-4 px-6 rounded-lg">
		        <div className="flex justify-between items-center pb-3">
		          <p className="text-lg font-semibold mb:2 ">Dados pessoais para entrega</p>
		          <div className="modal-close cursor-pointer z-50" onClick={() => props.close()}>
		            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
		              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
		            </svg>
		          </div>
		        </div>

		        <div className="w-full">
				  	<form>
				  		<p className="w-full text-md text-black font-semibold">Endereço</p>
				  		<div className="grid grid-cols-3 gap-1 mt-4">
						  	<div className="col-span-2">
     							<input 
									type="text"
			                        className="block border border-black-light w-full p-2 rounded-md mb-4"
									name="street"
									value={formData.street}
									placeholder="Rua"
									onChange={(e) => onChangeForm(e)}
			                    />
						  	</div>
						  	<div className="col-span-1">
     							<input 
									type="text"
			                        className="block border border-black-light w-full p-2 rounded-md mb-4"
									name="number_address"
									value={formData.number_address}
									placeholder="Número"
									onChange={(e) => onChangeForm(e)}
			                    />
						  	</div>
						  	<div className="col-span-3">
     							<input 
									type="text"
			                        className="block border border-black-light w-full p-3 rounded mb-4"
									name="district"
									value={formData.district}
									placeholder="Bairro"
									onChange={(e) => onChangeForm(e)}
			                    />
						  	</div>
						</div>
						<p className="w-full text-md text-black font-semibold mt-5">Dados do pagamento</p>
				  		<div className="grid grid-cols-3 gap-2">
						  	<div className="col-span-3">
     							<select 
     								className="block border border-black-light w-full p-2 rounded-md mb-4"
     								onChange={changeFormPayment}
     							>
								    <option value="-1">Esolha uma forma de pagamento</option>
								    {
								    	dataFormPayment.map((formPayment, index) => (
								    		<option key={index} value={formPayment.id}>{formPayment.label}</option>
								    	))
								    }
  								</select>
						  	</div>
						  	<div className="col-span-2">
			     				<input 
									type="text"
						            className="block border border-black-light w-full p-2 rounded-md mb-4"
									name="coupom"
									value={formData.coupom}
									placeholder="Cupom"
									onChange={(e) => setNameCoupom(e.target.value)}
						        />
							</div>
							<div className="col-span-1">
			     				<button onClick={getCoupomChangeName} className="bg-yellow p-2 rounded-md w-full p-2 text-white">
			     					Aplicar
			 					</button>
						  	</div>
						  	{
								valueDiscount !== 0 && (
						  			<div className="col-span-3">
										<p className="text-green">
								  			Você terá R$ {changeCommaForPoint(valueDiscount)} de desconto.
								  		</p>
						  			</div>
								)
						  	}
						  	<div className="col-span-3">
     							<input 
									type="text"
			                        className="block border border-black-light w-full p-3 rounded mb-4"
									name="observation"
									value={formData.observation}
									placeholder="Observação"
									onChange={(e) => onChangeForm(e)}
			                    />
						  	</div>
						</div>
				  	</form>  	
				</div>

		        <div className="flex justify-end pt-2">
		          	<button className="mr-2 bg-red p-2 rounded-lg text-white" onClick={() => props.close()}>Cancelar</button>
			        <button className="bg-green p-2 rounded-lg text-white" onClick={() => submitData()}>Finanlizar</button>
		        </div>
		      </div>
		    </div>
  		</div>
	);
}
export default ModalAddressClient;
