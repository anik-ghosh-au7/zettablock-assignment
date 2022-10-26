import React, { useEffect, useState } from 'react';
import './app.style.css';
import DataTable from './components/DataTable';
import { dummyData } from './data/dummyData';

const App = () => {
	const [apiData, setApiData] = useState();
	const fetchApiData = async () => {
		// const response = await fetch(
		// 	'https://62a6bb9697b6156bff7e6251.mockapi.io/v1/apis'
		// );
		// if (response.status === 200) {
		// 	const responseData = await response.json();
		// 	if (responseData?.length) {
		// 		setApiData(responseData);
		// 	}
		// }

		//for testing
		setApiData(dummyData);
	};
	useEffect(() => {
		fetchApiData();
	}, []);
	return <DataTable apiInputData={apiData} />;
};

export default App;
