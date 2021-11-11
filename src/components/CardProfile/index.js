import React, { useState, useEffect } from "react";
import { maskPhoneCell, getIdCompany } from "../../helpers.js";
import "../../index.css";
const CardProfile = ({ user, ...props }) => {
	const ID_COMPANY = getIdCompany();
	const [formData, setFormData] = useState(null);
	const [phoneCell, setPhoneCell] = useState("");
	const [enabledFields, setEnabledFields] = useState(false);

	useEffect(() => {
		setFormData({
			name: user.name_client,
			email: user.email_client
		});
		setPhoneCell(maskPhoneCell(user.phone_client));
	}, []);

	const onChangeForm = (e) => {
		var data = {
			name: formData.name,
			email: formData.email,
		}
		data[e.target.name] = e.target.value;
		setFormData(data);
	}

	const submitData = (e) => {
		const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client');
		props.updateDataClient({
			id_client: idClient,
			name_client: formData.name,
			email_client: formData.email,
			phone_client: phoneCell,
			id_company: ID_COMPANY
		});
		e.preventDefault();
	}

	const enabledFieldsOn = (e) => {
		setEnabledFields(!enabledFields);
		e.preventDefault();
	}

	const logout = (e) => {
		localStorage.clear();
		window.location.href = "/menu";
		e.preventDefault();
	}

	const resetFilds = (e) => {
		setFormData({
			name: user.name_client,
			email: user.email_client
		});
		setPhoneCell(maskPhoneCell(user.phone_client));
		setEnabledFields(!enabledFields);
		e.preventDefault();
	}

	return (
		<div>
			<form>
				<input
					type="text"
					className="block focus:border-2 focus:border-yellow w-full p-3 rounded mb-4"
					name="name"
					placeholder="Nome"
					value={formData && formData.name}
					onChange={(e) => onChangeForm(e)}
					disabled={!enabledFields}
				/>
				<input
					type="text"
					className="block focus:border-2 focus:border-yellow w-full p-3 rounded mb-4"
					name="phoneCell"
					placeholder="Telefone Celular"
					maxLength="15"
					value={phoneCell}
					onChange={(e) => setPhoneCell(maskPhoneCell(e.target.value))}
					disabled={!enabledFields}
				/>
				<input
					type="text"
					className="block focus:border-2 focus:border-yellow w-full p-3 rounded mb-4"
					name="email"
					placeholder="E-mail"
					value={formData && formData.email}
					onChange={(e) => onChangeForm(e)}
					disabled={!enabledFields}
				/>
				<button
					className="w-full text-center py-2 rounded bg-yellow text-white sm:py-3"
					onClick={!enabledFields ? (e) => enabledFieldsOn(e) : (e) => submitData(e)}
				>
					{!enabledFields ? "Deseja atualizar dados ? Sim." : "Atualizar"}
				</button>
				<button
					className="mt-3 w-full text-center bg-transparent border border-yellow text-yellow py-2 rounded sm:py-3"
					onClick={!enabledFields ? (e) => logout(e) : (e) => resetFilds(e)}
				>
					{!enabledFields ? "Sair da conta" : "Cancelar"}
				</button>
			</form>
		</div>
	)
}
export default CardProfile;
