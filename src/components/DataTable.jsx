/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
	actionTypes,
	paginationActions,
	sortOptions,
	searchOptions,
} from '../constants';
import { formatDateStr, copyTextToClipboard, getMaxPages } from '../utils';
import { ReactComponent as DeleteSvg } from '../icons/delete.svg';
import { ReactComponent as EditSvg } from '../icons/edit.svg';
import { ReactComponent as MaximizeSvg } from '../icons/maximize.svg';
import { ReactComponent as MinimizeSvg } from '../icons/minimize.svg';
import { ReactComponent as CopySvg } from '../icons/copy.svg';
import { ReactComponent as SortSvg } from '../icons/sort.svg';
import { ReactComponent as SortAscSvg } from '../icons/sortasc.svg';
import { ReactComponent as SortDescSvg } from '../icons/sortdesc.svg';
import { ReactComponent as SearchSvg } from '../icons/search.svg';
import { ReactComponent as ClearSvg } from '../icons/clear.svg';
import { ReactComponent as SaveSvg } from '../icons/save.svg';
import { ReactComponent as UndoSvg } from '../icons/undo.svg';
import { ReactComponent as RedoSvg } from '../icons/redo.svg';

const DataTable = ({
	apiData = [],
	sortData,
	setSortData,
	searchData,
	setSearchData,
	deleteApiData,
	editApiData,
}) => {
	const descriptionInputRef = useRef(null);
	const [apiList, setApiList] = useState([]);
	const [maxPages, setMaxPages] = useState(1);
	const [paginationData, setPaginationData] = useState({
		limit: 5,
		page: 1,
		offset: 0,
		total: 0,
	});
	const [selectedData, setSelectedData] = useState({
		data: null,
		action: null,
	});
	const renderSortButton = () => {
		switch (sortData) {
			case sortOptions.ASC:
				return (
					<button onClick={() => setSortData(sortOptions.DESC)}>
						<SortAscSvg />
					</button>
				);
			case sortOptions.DESC:
				return (
					<button onClick={() => setSortData(sortOptions.NONE)}>
						<SortDescSvg />
					</button>
				);
			default:
				return (
					<button onClick={() => setSortData(sortOptions.ASC)}>
						<SortSvg />
					</button>
				);
		}
	};
	const renderSearchButton = () => {
		switch (searchData.searchAction) {
			case searchOptions.SEARCH:
				return (
					<button
						onClick={() => {
							setSearchData({
								searchText: '',
								searchAction: null,
							});
						}}
					>
						<ClearSvg />
					</button>
				);
			default:
				return (
					<button
						onClick={() => {
							searchData.searchText &&
								setSearchData({
									...searchData,
									searchAction: searchOptions.SEARCH,
								});
						}}
					>
						<SearchSvg />
					</button>
				);
		}
	};
	const actionHandler = async (currentAction, currentData) => {
		setSelectedData({ action: currentAction, data: currentData });
		if (currentAction === actionTypes.DELETE) {
			await deleteApiData(currentData.id);
		}
		if (currentAction === actionTypes.SAVE) {
			await editApiData(currentData.id, selectedData.data.description);
		}
	};
	const paginationHandler = (action, payload = undefined) => {
		switch (action) {
			case paginationActions.PREV:
				setPaginationData({
					...paginationData,
					page: paginationData.page - 1,
					offset: paginationData.offset - paginationData.limit,
				});
				break;
			case paginationActions.NEXT:
				setPaginationData({
					...paginationData,
					page: paginationData.page + 1,
					offset: paginationData.offset + paginationData.limit,
				});
				break;
			case paginationActions.FIRST:
				setPaginationData({
					...paginationData,
					page: 1,
					offset: 0,
				});
				break;
			case paginationActions.LAST:
				setPaginationData({
					...paginationData,
					page: maxPages,
					offset: (maxPages - 1) * paginationData.limit,
				});
				break;
			case paginationActions.GOTO:
				let gotoPageNumber;
				if (payload.pageNumber > maxPages) {
					gotoPageNumber = maxPages;
				} else if (payload.pageNumber <= 0) {
					gotoPageNumber = 1;
				} else {
					gotoPageNumber = payload.pageNumber;
				}
				setPaginationData({
					...paginationData,
					page: gotoPageNumber,
					offset: (gotoPageNumber - 1) * paginationData.limit,
				});
				break;
			case paginationActions.SHOW:
				setPaginationData({
					...paginationData,
					page: 1,
					offset: 0,
					limit: payload.limit,
				});
				break;
			default:
				break;
		}
	};
	const searchInputHandler = (e) => {
		setSearchData({
			searchAction: searchOptions.CLEAR,
			searchText: e.target.value.trim(),
		});
	};
	const descriptionInputHandler = (e) => {
		setSelectedData({
			...selectedData,
			data: {
				...selectedData.data,
				description: e.target.value,
			},
		});
	};
	useEffect(() => {
		if (selectedData.action === actionTypes.EDIT && descriptionInputRef) {
			descriptionInputRef.current.focus();
		}
	}, [selectedData]);
	useEffect(() => {
		setPaginationData({
			...paginationData,
			total: apiData.length,
		});
	}, [apiData]);
	useEffect(() => {
		if (
			searchData.searchAction === searchOptions.SEARCH &&
			searchData.searchText
		) {
			setPaginationData({
				...paginationData,
				page: 1,
				offset: 0,
			});
		}
	}, [searchData.searchAction]);
	useEffect(() => {
		setMaxPages(getMaxPages(paginationData.limit, paginationData.total));
		const updatedData = apiData.slice(
			paginationData.offset,
			paginationData.offset + paginationData.limit
		);
		setApiList(updatedData);
	}, [apiData, paginationData]);
	return (
		<div className="container">
			<div>
				<h2>APIs: </h2>
				<input
					type="text"
					value={searchData.searchText}
					onChange={searchInputHandler}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							searchData.searchText &&
								setSearchData({
									...searchData,
									searchAction: searchOptions.SEARCH,
								});
						}
					}}
					placeholder="Search for keywords"
				></input>
				{renderSearchButton()}
			</div>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>ID</th>
						<th>
							Name
							{renderSortButton()}
						</th>
						<th>Type</th>
						<th>Description</th>
						<th>Created at</th>
						<th>Updated at</th>
					</tr>
				</thead>
				<tbody>
					{apiList.map((data) => {
						const strData = JSON.stringify(data, null, '\t').replace(
							/\\n/g,
							''
						);
						return (
							<Fragment key={data.id}>
								<tr>
									<td data-column="actions">
										<div>
											<button
												onClick={() => actionHandler(actionTypes.DELETE, data)}
											>
												<DeleteSvg />
											</button>
											{selectedData.data?.id === data.id &&
											selectedData.action === actionTypes.EDIT ? (
												<button
													onClick={() => actionHandler(actionTypes.SAVE, data)}
												>
													<SaveSvg />
												</button>
											) : (
												<button
													onClick={() => actionHandler(actionTypes.EDIT, data)}
												>
													<EditSvg />
												</button>
											)}
											{selectedData.action === actionTypes.MAXIMIZE &&
											selectedData.data?.id === data.id ? (
												<button
													onClick={() =>
														actionHandler(actionTypes.MINIMIZE, data)
													}
												>
													<MinimizeSvg />
												</button>
											) : (
												<button
													onClick={() =>
														actionHandler(actionTypes.MAXIMIZE, data)
													}
												>
													<MaximizeSvg />
												</button>
											)}
										</div>
										<input
											readOnly
											type="radio"
											checked={selectedData.data?.id === data.id}
										></input>
									</td>
									<td data-column="id">{data.id}</td>
									<td data-column="name">{data.name}</td>
									<td data-column="type">{data.type}</td>
									<td data-column="description">
										{selectedData.data?.id === data.id &&
										selectedData.action === actionTypes.EDIT ? (
											<div>
												<input
													ref={descriptionInputRef}
													value={selectedData.data.description}
													onChange={descriptionInputHandler}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															actionHandler(actionTypes.SAVE, data);
														}
													}}
												></input>
												<div>
													<button onClick={() => {}}>
														<UndoSvg />
													</button>
													<button onClick={() => {}}>
														<RedoSvg />
													</button>
												</div>
											</div>
										) : (
											data.description
										)}
									</td>
									<td data-column="createdAt">
										{formatDateStr(data.createdAt)}
									</td>
									<td data-column="updatedAt">
										{formatDateStr(data.updatedAt)}
									</td>
								</tr>
								{selectedData.action === actionTypes.MAXIMIZE &&
									selectedData.data?.id === data.id && (
										<tr>
											<td colSpan="7">
												<code className="json__content">
													<pre>{strData}</pre>
													<button onClick={() => copyTextToClipboard(strData)}>
														<CopySvg />
													</button>
												</code>
											</td>
										</tr>
									)}
							</Fragment>
						);
					})}
				</tbody>
			</table>
			<div className="pagination-container">
				<div className="pagination">
					<div>
						<button
							disabled={paginationData.page <= 1}
							onClick={() => paginationHandler(paginationActions.FIRST)}
						>
							{'<<'}
						</button>
						<button
							disabled={paginationData.page <= 1}
							onClick={() => paginationHandler(paginationActions.PREV)}
						>
							{'<'}
						</button>
					</div>
					<div>
						<h5>
							Page <b>{paginationData.page}</b> of <b>{maxPages}</b>
						</h5>
					</div>
					<div>
						<h5>Go to page:</h5>
						<input
							type="number"
							value={paginationData.page}
							max={maxPages}
							onChange={(e) => {
								if (e?.target?.value && !isNaN(e.target.value)) {
									let currentValue = parseInt(e.target.value);
									paginationHandler(paginationActions.GOTO, {
										pageNumber: currentValue > 0 ? currentValue : 1,
									});
								}
							}}
						></input>
					</div>
					<div>
						<select
							value={paginationData.limit}
							onChange={(e) =>
								paginationHandler(paginationActions.SHOW, {
									limit: parseInt(e.target.value),
								})
							}
						>
							<option value={5}>Show 5</option>
							<option value={10}>Show 10</option>
							<option value={15}>Show 15</option>
							<option value={20}>Show 20</option>
						</select>
					</div>
					<div>
						<button
							disabled={paginationData.page >= maxPages}
							onClick={() => paginationHandler(paginationActions.NEXT)}
						>
							{'>'}
						</button>
						<button
							disabled={paginationData.page >= maxPages}
							onClick={() => paginationHandler(paginationActions.LAST)}
						>
							{'>>'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataTable;
