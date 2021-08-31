import React, { useState } from "react";
import API from "../../server/api.js"
import { maskPhoneCell } from "../../helpers.js";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import "../../index.css";
const Register = () => {
	const ID_COMPANY = "4051e598-c3cf-4252-b38d-cb4df34fbbe2";
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password_confirm: ''
	});
	const [phoneCell, setPhoneCell] = useState("");

	const onRegister = async (event) => {
		console.log(formData);
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
                        console.log("MENSAGEM DE SUCESSO.");
                        setTimeout(() => {
                  			window.location.href = "/menu"
                        }, 2000);
                	}else{
						console.log("MENSAGEM DE ERROR.");               		
                	}
                }).catch((error) => {
                	setLoadingFlag(false);
                	console.log("MENSAGEM DE ERROR.");
                });
			}else{
				setLoadingFlag(false);
				console.log("MENSAGEM DE ERROR: PRENCHER CREDENCIAS DE FORMA CORRETA.");
			}
		}else{
			setLoadingFlag(false);
			console.log("MENSAGEM DE ERROR: PRENCHER CREDENCIAS DE FORMA CORRETA.");
		}
		event.preventDefault();
	}


	const onChangeForm = (e) => {
		console.log(e.target.name + ": " + e.target.value);
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
										<div className="bg-grey-lighter min-h-screen flex flex-col">
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
									                        maxlength="15"
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
								                    Você já possui conta ?
								                    <a className="no-underline border-b border-blue text-blue-500" href="/login">
								                        Entrar
								                    </a>
								                </div>
								            </div>
								        </div>
						        	</div>
						      	</div>
						    </div>
						</main>
					</div>
				):(
					<Loading time={3000}/>
				)
			}
		</div>
	);
}
export default Register;
