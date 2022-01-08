import React, { useState } from "react";
import { useAlert } from "react-alert";
import API from "../../server/api.js"
import { maskPhoneCell, getIdCompany } from "../../helpers.js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import "../../index.css";
const Register = () => {
	const ID_COMPANY = getIdCompany();
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password_confirm: ''
	});
	const [phoneCell, setPhoneCell] = useState("");
	const alert = useAlert();

	const onRegister = async (event) => {
		setLoadingFlag(true);
		if(formData.password.length >= 6 && (formData.password === formData.confirm_password)){
			if(phoneCell.length === 15  && formData.name.length > 1){
				API.post("createAccount/client",
                    {
                        name_client: formData.name, 
                        email_client: formData.email, 
                        password_client: formData.password, 
                        phone_client: phoneCell,
                        id_company: ID_COMPANY
                    }
                ).then((response) => {
                	setLoadingFlag(false);
                	if(response.status === 200){
                		localStorage.setItem('@masterpizza-delivery-app/token', response.data.token_client);
                        localStorage.setItem('@masterpizza-delivery-app/id_client', response.data.id_client);
                        alert.success(response.data.message);
                        setTimeout(() => {
                  			window.location.href = "/menu"
                        }, 1000);
                	}else{
                		alert.error(response.data.message);
                	}
                }).catch((error) => {
                	setLoadingFlag(false);
                	alert.error("Erro ao tentar fazer o cadastro!");
                });
			}else{
				setLoadingFlag(false);
				alert.error("Preencha todos os campos pedidos!");
			}
		}else{
			setLoadingFlag(false);
			alert.error("Preencha todos os campos pedidos!");
		}
		event.preventDefault();
	}

	const onChangeForm = (e) => {
		var data = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			password_confirm: formData.password_confirm
		}
		data[e.target.name] = e.target.value;
		setFormData(data);
	}

	return(
		<div>
			{
				!loadingFlag ? (
					<div>
						<Navbar />
						<main>
						    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
						      	<div className="px-4 py-6 sm:px-0">
						        	<div className="rounded-lg h-96">
								            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
								                <div className="bg-white px-6 py-4 rounded shadow-md text-black w-full">
								                    <h1 className="mb-8 text-3xl text-center font-bold text-black">Cadastro</h1>
								                    <form onSubmit={onRegister}>
									                    <input 
									                        type="text"
									                        className="block border border-black-light w-full p-3 rounded mb-4"
									                        name="name"
									                        placeholder="Nome"
									                        value={formData.name}
									                        onChange={(e) => onChangeForm(e)}
									                     />
									                    <input 
									                        type="text"
									                        className="block border border-black-light w-full p-3 rounded mb-4"
									                        name="phoneCell"
									                        placeholder="Telefone Celular"
									                        maxLength="15"
									                        value={phoneCell}
									                        onChange={(e) => setPhoneCell(maskPhoneCell(e.target.value))}
									                    />
									                    <input 
									                        type="text"
									                        className="block border border-black-light w-full p-3 rounded mb-4"
									                        name="email"
									                        placeholder="E-mail" 
									                        value={formData.email}
									                        onChange={(e) => onChangeForm(e)}
									                     />
									                    <input 
									                        type="password"
									                        className="block border border-black-light w-full p-3 rounded mb-4"
									                        name="password"
									                        placeholder="Senha"
									                        value={formData.password}
									                        onChange={(e) => onChangeForm(e)}
									                     />
									                    <input 
									                        type="password"
									                        className="block border border-black-light w-full p-3 rounded mb-4"
									                        name="confirm_password"
									                        placeholder="Confirme sua senha"
									                        value={formData.confirm_password}
									                        onChange={(e) => onChangeForm(e)}
									                    />
									                    <button
									                        type="submit"
									                        className="w-full text-center py-2 rounded bg-yellow text-white sm:py-3"
									                    >Criar conta</button>
								                    </form>
								                </div>
								                <div className="text-black mt-6">
								                    Você já possui conta ? <a className="no-underline border-b border-blue text-blue-500" href="/login">
								                    Entrar
								                    </a>
								                </div>
								            </div>
						        	</div>
						      	</div>
						    </div>
						</main>
						<Footer />
					</div>
				):(
					<Loading time={3000}/>
				)
			}
		</div>
	);
}
export default Register;
