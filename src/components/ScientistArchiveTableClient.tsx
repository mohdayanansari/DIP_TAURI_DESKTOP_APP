import { Spinner } from '@chakra-ui/react';
import SearchIcon from '@rsuite/icons/Search';
import { shell } from '@tauri-apps/api';
import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';
import moment from 'moment';

import React, { SetStateAction, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, InputGroup, Modal, Pagination, Table } from 'rsuite';
import { useAuth } from '../contexts/AuthContext';
import { axiosClient } from '../utils/axiosInstance';

const ScientistArchiveTableClient = () => {
	const { logout } = useAuth();
	const [limit, setLimit] = React.useState(10);
	const [page, setPage] = React.useState(1);
	const { Column, HeaderCell, Cell } = Table;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<any[]>([]);
	const [selectedData, setSelectedData] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');

	const [isFileDownloading, setIsFileDownloading] = useState<{
		[key: string]: boolean;
	}>({});
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setSelectedData([]);
	};

	const handleChangeLimit = (dataKey: SetStateAction<number>) => {
		setPage(1);
		setLimit(dataKey);
	};

	const filteredData = userData.filter((item) => {
		return (
			item.division[0]
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.dipasProjectId
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.customID.toLowerCase().includes(searchQuery.toLowerCase())
			// ... Add more fields to search
		);
	});
	const data = filteredData.filter((v, i) => {
		const start = limit * (page - 1);
		const end = start + limit;
		return i >= start && i < end;
	});

	const selectedRow = async (rowId: string) => {
		handleOpen();
		console.log(rowId);

		const filterRowData = await userData.find(
			(item) => item.customID === rowId
		);
		setSelectedData(filterRowData);
	};

	const downloadSelectedFile = async (selectedFileId: string) => {
		if (typeof window !== 'undefined') {
			setIsFileDownloading((prev) => ({
				...prev,
				[selectedFileId]: true,
			}));
			const token = localStorage.getItem('token');
			console.log('Selected File ID --> ', selectedFileId);
			try {
				const res = await axiosClient.get(
					`/rdm-form/file/${selectedFileId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (res.status === 200) {
					await shell.open(
						`https://dip-server-w83b.onrender.com/api/v1/rdm-form/file/${selectedFileId}`
					);

					toast.success('File is downloading...', {
						position: 'bottom-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'colored',
					});
				}
			} catch (error: any) {
				if (error.response?.data?.message === 'Invalid AT') {
					logout();
					let permissionGranted = await isPermissionGranted();
					if (!permissionGranted) {
						const permission = await requestPermission();
						permissionGranted = permission === 'granted';
					}
					if (permissionGranted) {
						sendNotification({
							title: 'DIP',
							body: 'Session Timeout! Please Login Again...',
						});
					}
				}
			} finally {
				setIsFileDownloading((prev) => ({
					...prev,
					[selectedFileId]: false,
				}));
			}
		}
	};

	const fetchUser = async () => {
		setIsLoading(true);
		const token = localStorage.getItem('token');

		try {
			const res = await axiosClient.get('/user/curr-user', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.data.success) {
				setUserData(res.data.user.rdmForm); // Assuming user data is present in the 'data' property
				console.log(res.data);
				setIsLoading(false);
			}
		} catch (error: any) {
			if (error.response?.data?.message === 'Invalid AT') {
				logout();
				let permissionGranted = await isPermissionGranted();
				if (!permissionGranted) {
					const permission = await requestPermission();
					permissionGranted = permission === 'granted';
				}
				if (permissionGranted) {
					sendNotification({
						title: 'DIP',
						body: 'Session Timeout! Please Login Again...',
					});
				}
			}
			console.error('Error in fetching current user ', error);
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			fetchUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex flex-col w-full text-xs'>
			<ToastContainer />

			<div className='px-5 my-5'>
				<InputGroup>
					<Input
						type='search'
						placeholder='Search by DIP-Diary ID, Group/Division, DIPAS Project ID/Task ID...'
						value={searchQuery}
						onChange={(value) => setSearchQuery(value)}
					/>
					<InputGroup.Button>
						<SearchIcon />
					</InputGroup.Button>
				</InputGroup>
			</div>
			<Table
				// virtualized
				loading={isLoading}
				className='!w-full '
				// height={400}
				autoHeight
				data={data}
				// onRowClick={(rowData) => {
				// 	console.log(rowData);
				// }}
			>
				<Column width={200} align='center' fixed resizable>
					<HeaderCell>DIP-Diary-Data ID</HeaderCell>
					<Cell dataKey='customID' />
				</Column>

				<Column width={120} resizable>
					<HeaderCell>Group/Division</HeaderCell>
					<Cell dataKey='division' />
				</Column>

				<Column width={200} resizable>
					<HeaderCell>DIPAS Project ID/Task ID</HeaderCell>
					<Cell dataKey='dipasProjectId' />
				</Column>

				<Column width={300} resizable>
					<HeaderCell>Keywords/Objective of Experiment</HeaderCell>
					<Cell dataKey='experimentObjective' />
				</Column>

				<Column width={200} resizable>
					<HeaderCell>Manuscript Title</HeaderCell>
					<Cell dataKey='manuscriptTitle' />
				</Column>

				<Column width={150} resizable>
					<HeaderCell>No. Raw Data Files</HeaderCell>
					<Cell dataKey='rawFiles' />
				</Column>

				<Column width={100} resizable>
					<HeaderCell>Data Provided By</HeaderCell>
					<Cell dataKey='dataProvidedBy' />
				</Column>
				<Column width={100} resizable>
					<HeaderCell>Data Type</HeaderCell>
					<Cell dataKey='dataType' />
				</Column>
				<Column width={150} resizable>
					<HeaderCell>Experimental Organism</HeaderCell>
					<Cell dataKey='experimentalOrganism' />
				</Column>
				<Column width={150} resizable>
					<HeaderCell>Tissue</HeaderCell>
					<Cell dataKey='Tissues' />
				</Column>
				<Column width={300} resizable>
					<HeaderCell>Broad Data Type</HeaderCell>
					<Cell dataKey='BroadDataTypes' />
				</Column>
				<Column width={220}>
					<HeaderCell>Created Date</HeaderCell>
					<Cell>
						{(rowData) =>
							moment(rowData.createdAt).format(
								'MMMM Do YYYY, h:mm:ss A'
							)
						}
					</Cell>
				</Column>

				{/* -----EDIT----- */}
				<Column width={120} fixed='right'>
					<HeaderCell>Download Files</HeaderCell>

					<Cell
						style={{ padding: '6px' }}
						className='flex items-center justify-center text-center '
					>
						{(rowData) => (
							<Button
								appearance='link'
								onClick={() => selectedRow(rowData.customID)}
							>
								Files
							</Button>
						)}
					</Cell>
				</Column>
			</Table>
			<div style={{ padding: 20 }}>
				<Pagination
					prev
					next
					first
					last
					ellipsis
					boundaryLinks
					maxButtons={5}
					size='xs'
					layout={['total', '-', 'limit', '|', 'pager', 'skip']}
					total={userData.length}
					limitOptions={[5, 10, 30, 50, 100, 150, 200]}
					limit={limit}
					activePage={page}
					onChangePage={setPage}
					onChangeLimit={handleChangeLimit}
				/>
			</div>
			{/* -------- File Download Modal --------- */}
			<Modal
				backdrop={'static'}
				overflow={true}
				size='md'
				keyboard={false}
				open={open}
				onClose={handleClose}
			>
				<Modal.Header>
					<Modal.Title>
						{/* @ts-ignore */}
						Showing Files-{selectedData?.customID}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<div className='flex flex-col w-full gap-5'>
						{
							// @ts-ignore
							selectedData?.files?.map((item, index) => {
								return (
									<div
										key={index}
										className='p-2 border rounded-md border-black-10 bg-slate-50 drop-shadow'
									>
										<div>
											<p className='text-lg'>
												DIP-Diary-Data File ID:
											</p>
											<p className='text-lg font-bold'>
												{item.customID}
											</p>
										</div>
										<div>
											<p className='text-lg'>
												Content Type:
											</p>
											<p className='text-lg'>
												{item.contentType}
											</p>
										</div>
										<div>
											{isFileDownloading[
												item.filename
											] ? (
												<Spinner color='red.500' />
											) : (
												<button
													onClick={() =>
														downloadSelectedFile(
															item.filename
														)
													}
													className='p-2 text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-800'
												>
													Download File
												</button>
											)}
										</div>
									</div>
								);
							})
						}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={handleClose}
						appearance='primary'
						className='bg-blue-500'
					>
						Ok
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ScientistArchiveTableClient;
