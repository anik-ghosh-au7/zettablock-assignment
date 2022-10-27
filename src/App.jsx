import React, { useEffect, useState } from 'react';
import './app.style.css';
import DataTable from './components/DataTable';
import { searchOptions, sortOptions, tabOptions } from './constants';
import { dummyData } from './dummyData';

const App = () => {
	const [apiRawData, setApiRawData] = useState([]);
	const [activeTab, setActiveTab] = useState(tabOptions.API);
	const [apiData, setApiData] = useState();
	const [sortData, setSortData] = useState(sortOptions.NONE);
	const [searchData, setSearchData] = useState({
		searchText: '',
		searchAction: null,
	});
	const fetchApiData = async () => {
		const response = await fetch(
			'https://62a6bb9697b6156bff7e6251.mockapi.io/v1/apis'
		);
		if (response.status === 200) {
			const responseData = await response.json();
			if (responseData?.length) {
				setApiRawData(responseData);
			}
		}
	};
	const deleteApiData = async (dataId) => {
		const dataIndex = apiData.findIndex((data) => data.id === dataId);
		const apiDataCopy = [...apiData];
		apiDataCopy.splice(dataIndex, 1);
		setApiData(apiDataCopy);
		await fetch(
			`https://62a6bb9697b6156bff7e6251.mockapi.io/v1/apis/${dataId}`,
			{
				method: 'DELETE',
			}
		);
		fetchApiData();
	};
	const editApiData = async (dataId, description) => {
		const dataIndex = apiData.findIndex((data) => data.id === dataId);
		const apiDataCopy = [...apiData];
		const apiDataItem = { ...apiData[dataIndex] };
		apiDataItem.description = description;
		apiDataCopy[dataIndex] = apiDataItem;
		setApiData(apiDataCopy);
		await fetch(
			`https://62a6bb9697b6156bff7e6251.mockapi.io/v1/apis/${dataId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ description }),
			}
		);
		fetchApiData();
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
		<div className="tabs">
			<nav className="tabs__nav" role="tablist">
				<button
					className={`tabs__btn ${
						activeTab === tabOptions.API ? 'is-active' : ''
					}`}
					type="button"
					role="tab"
					onClick={() => setActiveTab(tabOptions.API)}
				>
					Tab #1
				</button>
				<button
					className={`tabs__btn ${
						activeTab === tabOptions.DUMMY ? 'is-active' : ''
					}`}
					type="button"
					role="tab"
					onClick={() => setActiveTab(tabOptions.DUMMY)}
				>
					Tab #2
				</button>
			</nav>
			<div className="tabs__content">
				<div
					className={`tabs__pane ${
						activeTab === tabOptions.API ? 'is-visible' : ''
					}`}
					id="tab-1"
					role="tabpanel"
				>
					<DataTable
						title="APIs Data:"
						apiData={apiData}
						sortData={sortData}
						setSortData={setSortData}
						searchData={searchData}
						setSearchData={setSearchData}
						deleteApiData={deleteApiData}
						editApiData={editApiData}
					/>
				</div>
				<div
					className={`tabs__pane ${
						activeTab === tabOptions.DUMMY ? 'is-visible' : ''
					}`}
					id="tab-2"
					role="tabpanel"
				>
					<DataTable
						title="Dummy Data:"
						apiData={dummyData}
						sortData={sortData}
						setSortData={setSortData}
						searchData={searchData}
						setSearchData={setSearchData}
						deleteApiData={deleteApiData}
						editApiData={editApiData}
					/>
				</div>
			</div>
		</div>
	);
};

export default App;
