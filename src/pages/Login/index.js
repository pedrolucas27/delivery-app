import React, { useState } from "react";
import API from "../../server/api.js"
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import "../../index.css";
const Login = () => {
	const ID_COMPANY = "4051e598-c3cf-4252-b38d-cb4df34fbbe2";
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const onAuth = async (event) => {
		setLoadingFlag(true);
		API.post("authentication/client",
            {
                user: formData.username, 
                password_client: formData.password, 
                id_company: ID_COMPANY
            }
        ).then((response) => {
        	setLoadingFlag(false);
        	if(response.status === 200){
        		localStorage.setItem('@masterpizza-delivery-app/token', response.data.token_client);
                localStorage.setItem('@masterpizza-delivery-app/id_client', response.data.id_client);
                console.log("MENSAGEM DE BOAS VINDAS.");
                setTimeout(() => {
                	window.location.href = "/menu"
                }, 1000);
        	}else{
        		console.log("MENSAGEM DE ERROR.");
        	}
        }).catch((error) => {
        	setLoadingFlag(false);
        	console.log("MENSAGEM DE ERROR.");
        });
        event.preventDefault();
	}

	const onChangeForm = (e) => {
		console.log(e.target.name + ": " + e.target.value);
		var data = {
			username: formData.username,
			password: formData.password,
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
								                <div className="bg-white px-6 py-4 shadow-lg rounded shadow-md text-black w-full h-full">
								                    <h1 className="mb-8 text-3xl text-center">Login</h1>
								                    <form onSubmit={onAuth}>
										                <input 
										                    type="text"
										                    className="block border border-black-light w-full p-3 rounded mb-4"
										                    name="username"
										                    placeholder="E-mail ou Telefone Celular"
									                        value={formData.username}
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
									                    <button
									                        type="submit"
									                        className="w-full text-center py-2 rounded bg-yellow text-white sm:py-3"
									                    >Entrar</button>
								                    </form>
								                </div>
									            <div className="text-grey-dark mt-6">
									                Não possui conta ?
									                <a className="no-underline border-b border-blue text-blue-500" href="/register">
									                    Criar conta
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
export default Login;
