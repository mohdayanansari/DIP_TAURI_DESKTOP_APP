import SearchIcon from '@rsuite/icons/Search';
import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';
import moment from 'moment';

import React, { SetStateAction, useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, InputGroup, Modal, Pagination, Table } from 'rsuite';
import { useAuth } from '../contexts/AuthContext';
import { axiosClient } from '../utils/axiosInstance';
import ShowSelectedDataTable from './ShowSelectedDataTable';

const HODReportTable = ({ division }: { division: string }) => {
	const { logout } = useAuth();
	const [limit, setLimit] = React.useState(10);
	const [page, setPage] = React.useState(1);
	const { Column, HeaderCell, Cell } = Table;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<any[]>([]);
	const [selectedData, setSelectedData] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedUser, setSelectedUser] = useState('');
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setSelectedData([]);
		setSelectedUser('');
	};

	const handleChangeLimit = (dataKey: SetStateAction<number>) => {
		setPage(1);
		setLimit(dataKey);
	};

	// filter division users ===>
	const divisionFilterUsers = userData.filter(
		(item) => item.division[0] === division[0]
	);

	const filteredData = divisionFilterUsers.filter((item) => {
		return (
			item.division[0]
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.roles[0].toLowerCase().includes(searchQuery.toLowerCase())

			// ... Add more fields to search
		);
	});
	const data = filteredData.filter((v, i) => {
		const start = limit * (page - 1);
		const end = start + limit;
		return i >= start && i < end;
	});

	const selectedRow = async (rowId: string, fname: string) => {
		handleOpen();
		// console.log(rowId);

		const filterRowData = await userData.find((item) => item._id === rowId);
		setSelectedData(filterRowData.rdmForm);
		setSelectedUser(fname);
		// console.log(filterRowData.rdmForm);
	};

	const fetchUser = async () => {
		setIsLoading(true);
		const token = localStorage.getItem('token');

		try {
			const res = await axiosClient.get('/user', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.data.success) {
				setUserData(res.data.users);
				// console.log(res.data);
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
			<div className='px-5 my-5'>
				<InputGroup>
					<Input
						type='search'
						placeholder='Search by Name, Group/Division, Designation...'
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
				<Column width={150} align='center' fixed resizable>
					<HeaderCell>First Name</HeaderCell>
					<Cell dataKey='fname' />
				</Column>

				<Column width={150} resizable>
					<HeaderCell>Last Name</HeaderCell>
					<Cell dataKey='lname' />
				</Column>

				<Column width={150} resizable>
					<HeaderCell>Family Name</HeaderCell>
					<Cell dataKey='familyName' />
				</Column>

				<Column width={150} resizable>
					<HeaderCell>Designation</HeaderCell>
					<Cell dataKey='roles' className='font-bold uppercase' />
				</Column>

				<Column width={100} resizable>
					<HeaderCell>Division</HeaderCell>
					<Cell dataKey='division' />
				</Column>

				<Column width={200} resizable>
					<HeaderCell>Department</HeaderCell>
					<Cell dataKey='department' />
				</Column>

				<Column width={250} resizable>
					<HeaderCell>Email</HeaderCell>
					<Cell dataKey='email' />
				</Column>
				<Column width={150} resizable>
					<HeaderCell>Phone</HeaderCell>
					<Cell dataKey='phone' />
				</Column>
				<Column width={200} resizable>
					<HeaderCell>DOB</HeaderCell>
					<Cell>
						{(rowData) =>
							moment(rowData.dob).format('MMMM Do YYYY')
						}
					</Cell>
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
				<Column width={150} fixed='right'>
					<HeaderCell>Show RDM Form Data</HeaderCell>

					<Cell
						style={{ padding: '6px' }}
						className='flex items-center justify-center text-center '
					>
						{(rowData) => (
							<Button
								appearance='link'
								onClick={() =>
									selectedRow(rowData._id, rowData.fname)
								}
							>
								View
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
				size='full'
				keyboard={false}
				open={open}
				onClose={handleClose}
			>
				<Modal.Header>
					<Modal.Title>
						{/* @ts-ignore */}
						Showing RDM Form Data-{selectedUser}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<div className='flex flex-col w-full gap-5'>
						<ShowSelectedDataTable userData={selectedData} />
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

export default HODReportTable;
