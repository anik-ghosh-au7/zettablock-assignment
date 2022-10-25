import React, { useEffect, useState } from 'react';
import './app.style.css';
import DataTable from './components/DataTable';

const App = () => {
	const [apiData, setApiData] = useState();
	const fetchApiData = async () => {
		const response = await fetch(
			'https://62a6bb9697b6156bff7e6251.mockapi.io/v1/apis'
		);
		if (response.status === 200) {
			const responseData = await response.json();
			if (responseData?.length) {
				setApiData(responseData);
			}
		}
	};
	useEffect(() => {
		fetchApiData();
	}, []);
	return <DataTable apiData={apiData} />;
};

export default App;
