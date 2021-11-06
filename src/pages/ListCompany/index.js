import React,{ useState, useEffect } from "react";
import { useAlert } from 'react-alert';
import API from "../../server/api.js";
import { maskPhoneCell, getIdCompany } from "../../helpers.js";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import "../../index.css";

const ListCompany = () => {
	const ID_COMPANY = getIdCompany();
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [company, setCompany] = useState("");
	const alert = useAlert();

	useEffect(() => {
		setLoadingFlag(true);
		API.get("establishment/"+ID_COMPANY).then((response) => {
			setCompany(response.data[0]);
			setLoadingFlag(false);
		}).catch((error) => {
			setLoadingFlag(false);
			alert.error('Erro ao tentar listar informações do estabelecimento!');
		});
	}, []);

	return(
		<div>
			{
				loadingFlag ? (
					<Loading time={4000}/>
				):(
					<div>
						<Navbar current={"company"} />
						<Header title={'Estabelecimento'} timeWork={[company.start_time, company.end_time]}/>
						<main>
						    <div className="max-w-7xl mx-auto py-0 sm:px-6 lg:px-8">
						      	<div className="px-4 py-4 sm:px-0 py-6">
						        	<div className="rounded-lg h-96">
							        	<div>
							        		<div>
							        			<div className="flex justify-center">
							        				<div>
							        					<span>
															<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
															</svg>
							        					</span>
							        				</div>
							        				<div>
							        					<p className="text-lg font-semibold mb:2 ml-3 md:text-2xl">Contatos</p>
							        				</div>
							        			</div>
							        			<p className="mt-3 text-center">
							        				Telefone Celular: {maskPhoneCell(company.phone)}
							        			</p>
							        			<p className="mt-3 text-center">
							        				Intagram: {company.user_instagram || "-"}
							        			</p>
							        			<p className="mt-3 text-center">
							        				Facebook: {company.user_facebook || "-"}
							        			</p>
							        			<p className="mt-3 text-center">
							        				WhatsApp: {maskPhoneCell(company.user_whatsapp) || "-"}
							        			</p>
							        		</div>

							        		<div className="mt-10">
							        			<div className="flex justify-center">
							        				<div>
							        					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
							        				</div>
							        				<div>
							        					<p className="text-lg font-semibold mb:2 ml-3 md:text-2xl">Endereço</p>
							        				</div>
							        			</div>
							        			<p className="mt-3 text-center">
														Logradouro:	{company.street}, {company.number_house}, {company.district} 
							        			</p>
							        			<p className="mt-3 text-center">
														Cidade: {company.city}
							        			</p>
							        			<p className="mt-3 text-center">
														Cep: {company.cep}
							        			</p>
							        		</div>
							        	</div>
						        	</div>
						      	</div>
						    </div>
						</main>
						<Footer />
					</div>
				)
			}
		</div>
	)
}
export default ListCompany;
