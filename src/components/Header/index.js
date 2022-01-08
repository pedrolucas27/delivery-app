import React, { useEffect, useState } from "react";

import { useAlert } from 'react-alert';
import { getIdCompany } from "../../helpers.js";
import API from "../../server/api.js";

import "../../index.css";
const Header = ({ title }) => {

	const ID_COMPANY = getIdCompany();
	const [company, setCompany] = useState(null);
	const alert = useAlert();

	const isOpenEstablishment = (timeWork) => {
		let flag = false;
		if (timeWork[0]) {
			let startTime = `${Number(timeWork[0].split(':')[0]) + 12}:${timeWork[0].split(':')[1]}:${timeWork[0].split(':')[2]}`;
			let endTime = `${Number(timeWork[1].split(':')[0]) + 12}:${timeWork[1].split(':')[1]}:${timeWork[1].split(':')[2]}`;
			let currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;

			if (currentTime >= startTime && currentTime <= endTime) {
				flag = true;
			}
		}

		return flag;
	}

	useEffect(() => {
		API.get("establishment/" + ID_COMPANY).then((response) => {
			setCompany(response.data[0]);
		}).catch((error) => {
			alert.error('Erro ao tentar listar informações do estabelecimento!');
		});
	}, []);

	return (
		<header className="bg-white shadow">
			<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-black">
					{title}
				</h1>
				{
					company && company.is_active === 1 ? (
						isOpenEstablishment([company.start_time, company.end_time]) ? (
							<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green rounded">
								ABERTO AGORA
							</span>
						) : (
							<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red rounded">
								FECHADO AGORA
							</span>
						)
					) : (
						<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red rounded">
							FECHADO AGORA
						</span>
					)
				}

			</div>
		</header>
	);
}
export default Header;
