import React, { useEffect, useState } from 'react';
import './app.style.css';
import DataTable from './components/DataTable';
import { searchOptions, sortOptions } from './constants';
import { dummyData } from './data/dummyData';

const App = () => {
	const [apiRawData, setRawApiData] = useState([]);
	const [apiData, setApiData] = useState();
	const [sortData, setSortData] = useState(sortOptions.NONE);
	const [searchData, setSearchData] = useState({
		searchText: '',
		searchAction: null,
	});
	const fetchApiData = async () => {
		// const response = await fetch(
		// 	'https://62a6bb9697b6156bff7e6251.mockapi.io/v1/apis'
		// );
		// if (response.status === 200) {
		// 	const responseData = await response.json();
		// 	if (responseData?.length) {
		// 		setRawApiData(responseData);
		// 	}
		// }

		//for testing
		setRawApiData(dummyData);
	};
	useEffect(() => {
		fetchApiData();
	}, []);
	useEffect(() => {
		let formattedData;
		let apiDataCopy = [...apiRawData];
		switch (sortData) {
			case sortOptions.ASC:
				formattedData = apiDataCopy.sort((a, b) => (a.name > b.name ? 1 : -1));
				break;
			case sortOptions.DESC:
				formattedData = apiDataCopy.sort((a, b) => (a.name > b.name ? -1 : 1));
				break;
			default:
				formattedData = [...apiDataCopy];
				break;
		}
		if (searchData.searchAction === searchOptions.SEARCH) {
			formattedData = formattedData.filter((data) =>
				(data.name + data.description)
					.toLowerCase()
					.includes(searchData.searchText)
			);
		}
		setApiData(formattedData);
	}, [sortData, searchData, apiRawData]);
	return (
		<DataTable
			apiData={apiData}
			sortData={sortData}
			setSortData={setSortData}
			searchData={searchData}
			setSearchData={setSearchData}
		/>
	);
};

export default App;
