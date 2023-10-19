import {
	Box,
	Button,
	HStack,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Tooltip,
	useRadio,
	useRadioGroup,
} from '@chakra-ui/react';
import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';

import React, { ChangeEvent, useRef, useState } from 'react';
import { BsDiscFill } from 'react-icons/bs';
import { GoMultiSelect } from 'react-icons/go';
import { HiMail } from 'react-icons/hi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button as ButtonR, Modal } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import { axiosClient } from '../utils/axiosInstance';

type STATE = {
	division: string;
	dipasProjectId: string;
	experimentObjective: string;
	manuscriptTitle: string;
	rawFiles: string;
	dataProvidedBy: string;
	dataType: string;
	experimentalOrganism: string;
	Tissues: string;
	BroadDataTypes: string;
	clientId?: string;
};

const RDMForm = () => {
	const { logout } = useAuth();
	const expOrganismRef = useRef<HTMLInputElement>(null);
	const tissueRef = useRef<HTMLInputElement>(null);
	const bdtRef = useRef<HTMLInputElement>(null);
	const [state, setState] = useState<STATE>({
		division: '',
		dipasProjectId: '',
		experimentObjective: '',
		manuscriptTitle: '',
		rawFiles: '',
		dataProvidedBy: '',
		dataType: '',
		experimentalOrganism: '',
		Tissues: '',
		BroadDataTypes: '',
	});
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [isDropdownOpenT, setDropdownOpenT] = useState(false);
	const [isDropdownOpenbdtRef, setDropdownOpenbdtRef] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [resData, setResData] = useState<[] | null>([]);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setResData([]);
	};
	// ! ===== Custom Radio ========
	// 1. Create a component that consumes the `useRadio` hook
	function RadioCard(props: any) {
		const { getInputProps, getRadioProps } = useRadio(props);

		const input = getInputProps();
		const checkbox = getRadioProps();

		return (
			<Box as='label'>
				<input required {...input} />
				<Tooltip hasArrow placement='top' label='Click to choose me!'>
					<Box
						{...checkbox}
						cursor='pointer'
						borderWidth='1px'
						borderRadius='md'
						boxShadow='md'
						_checked={{
							bg: 'blue.600',
							color: 'white',
							borderColor: 'blue.600',
						}}
						_focus={{
							boxShadow: 'outline',
						}}
						px={5}
						width={200}
						py={1.5}
						className='flex items-center justify-center gap-2'
					>
						{props.children === 'Email' ? (
							<HiMail size={22} />
						) : (
							<BsDiscFill size={22} />
						)}
						{props.children}
					</Box>
				</Tooltip>
			</Box>
		);
	}
	// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
	function DataProvidedBy() {
		const options = ['Email', 'CD'];

		const { getRootProps, getRadioProps } = useRadioGroup({
			// name: '',
			value: state.dataProvidedBy,
			onChange: (value) =>
				setState((prevState) => ({
					...prevState,
					dataProvidedBy: value,
				})),
		});

		const group = getRootProps();

		return (
			<HStack {...group}>
				{options.map((value) => {
					const radio = getRadioProps({ value });
					return (
						<RadioCard key={value} {...radio}>
							{value}
						</RadioCard>
					);
				})}
			</HStack>
		);
	}
	// ! ===== Custom Radio ======== END =======

	const handleDropdownToggle = () => {
		setDropdownOpen(!isDropdownOpen);
		// If you want to focus the input when the dropdown is opened
		if (!isDropdownOpen && expOrganismRef.current) {
			expOrganismRef.current.focus();
		}
	};
	const handleDropdownToggleT = () => {
		setDropdownOpenT(!isDropdownOpenT);
		// If you want to focus the input when the dropdown is opened
		if (!isDropdownOpenT && tissueRef.current) {
			tissueRef.current.focus();
		}
	};
	const handleDropdownTogglebdtRef = () => {
		setDropdownOpenbdtRef(!isDropdownOpenbdtRef);
		// If you want to focus the input when the dropdown is opened
		if (!isDropdownOpenbdtRef && bdtRef.current) {
			bdtRef.current.focus();
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files: FileList = e.target.files;
			const filesArray: File[] = Array.from(files);
			setSelectedFiles(filesArray);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		console.log(state);
		console.log(selectedFiles);
		if (!state.dataProvidedBy) {
			toast.error(`Please provide data provided by "email" or "cd"`, {
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
		try {
			const token = localStorage.getItem('token');
			const clientId = uuidv4();
			const formData = new FormData();
			// Append files to FormData
			for (let i = 0; i < selectedFiles.length; i++) {
				formData.append('files', selectedFiles[i]);
			}
			// append data
			formData.append('division', state.division);
			formData.append('dipasProjectId', state.dipasProjectId);
			formData.append('experimentObjective', state.experimentObjective);
			formData.append('manuscriptTitle', state.manuscriptTitle);
			formData.append('rawFiles', state.rawFiles);
			formData.append('dataProvidedBy', state.dataProvidedBy);
			formData.append('dataType', state.dataType);
			formData.append('experimentalOrganism', state.experimentalOrganism);
			formData.append('Tissues', state.Tissues);
			formData.append('BroadDataTypes', state.BroadDataTypes);
			formData.append('clientId', clientId);
			const res = await axiosClient.post('/rdm-form', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			if (res.data?.success) {
				setResData(res.data.form);
				toast.success('User Updated Successfully...', {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'colored',
				});
				handleOpen();
				setState({
					division: '',
					dipasProjectId: '',
					experimentObjective: '',
					manuscriptTitle: '',
					rawFiles: '',
					dataProvidedBy: '',
					dataType: '',
					experimentalOrganism: '',
					Tissues: '',
					BroadDataTypes: '',
				});
				setSelectedFiles([]);
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
			} else {
				toast.error(`Error: ${error.response?.data?.message}`, {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'colored',
				});
				setState({
					division: '',
					dipasProjectId: '',
					experimentObjective: '',
					manuscriptTitle: '',
					rawFiles: '',
					dataProvidedBy: '',
					dataType: '',
					experimentalOrganism: '',
					Tissues: '',
					BroadDataTypes: '',
				});
				setSelectedFiles([]);
				setIsLoading(false);
			}
			console.log('Error in fetching current user ', error);
		} finally {
			setState({
				division: '',
				dipasProjectId: '',
				experimentObjective: '',
				manuscriptTitle: '',
				rawFiles: '',
				dataProvidedBy: '',
				dataType: '',
				experimentalOrganism: '',
				Tissues: '',
				BroadDataTypes: '',
			});
			setSelectedFiles([]);
			setIsLoading(false);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className='flex flex-col w-full gap-5 p-5 pt-0'
			>
				<ToastContainer />
				{/* ----------------division--------------- */}
				<div className='relative w-full'>
					<GoMultiSelect
						className='absolute top-[8px] right-[30px]'
						size={22}
					/>
					<InputGroup>
						<InputLeftAddon>
							Group/Division Name: (IPSS/OHS/AP/SP/PDT)
						</InputLeftAddon>

						<Select
							required
							placeholder='Select Division'
							onChange={(e) =>
								setState((prev) => ({
									...prev,
									division: e.target.value,
								}))
							}
						>
							<option value='IPSS'>IPSS</option>
							<option value='OHS'>OHS</option>
							<option value='AP'>AP</option>
							<option value='SP'>SP</option>
							<option value='PDT'>PDT</option>
						</Select>
					</InputGroup>
				</div>
				{/* Dipas Project id / task id */}
				<InputGroup>
					<InputLeftAddon>DIPAS Project ID / Task ID</InputLeftAddon>
					<Input
						type='text'
						maxLength={200}
						required
						placeholder='Enter the DIPAS project ID or Task ID'
						value={state.dipasProjectId}
						onChange={(e) =>
							setState((prev) => ({
								...prev,
								dipasProjectId: e.target.value,
							}))
						}
					/>
				</InputGroup>
				{/* KeyWords/Objective of the experiment */}
				<InputGroup>
					<InputLeftAddon>
						Keywords/Objective of the Experiment
					</InputLeftAddon>
					<Input
						type='text'
						maxLength={100}
						required
						placeholder='Enter the objective of the experiment (50 characters)'
						value={state.experimentObjective}
						onChange={(e) =>
							setState((prev) => ({
								...prev,
								experimentObjective: e.target.value,
							}))
						}
					/>
				</InputGroup>
				{/* Title of Manuscript */}
				<InputGroup>
					<InputLeftAddon>Title of Manuscript</InputLeftAddon>
					<Input
						type='text'
						// maxLength={100}
						required
						value={state.manuscriptTitle}
						onChange={(e) =>
							setState((prev) => ({
								...prev,
								manuscriptTitle: e.target.value,
							}))
						}
						placeholder='Enter the title'
					/>
				</InputGroup>
				{/* Number of raw data files */}
				<InputGroup>
					<InputLeftAddon>Number of Raw Data Files</InputLeftAddon>
					<NumberInput
						className='w-full'
						// defaultValue={0}
						min={0}
						max={200}
					>
						<NumberInputField
							placeholder='Enter the number of raw data files'
							required
							value={state.rawFiles}
							onChange={(valueString) =>
								setState((prevState) => ({
									...prevState,
									rawFiles: valueString.target.value,
								}))
							}
						/>
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</InputGroup>
				{/* Data Provided By  */}
				<InputGroup className='flex w-full gap-5 border border-gray-200 rounded-md bg-slate-50 '>
					<InputLeftAddon>Data Provided by</InputLeftAddon>
					<DataProvidedBy />
				</InputGroup>
				{/* Data Type */}
				<InputGroup className='flex items-center w-full gap-5 border border-gray-200 rounded-md bg-slate-50'>
					<InputLeftAddon>Data Type</InputLeftAddon>
					<RadioGroup
						value={state.dataType}
						onChange={(data) =>
							setState((prevState) => ({
								...prevState,
								dataType: data,
							}))
						}
					>
						<Stack spacing={4} direction='row'>
							<Radio value='Field Data'>Field Data</Radio>
							<Radio value='Lab Experiment Data'>
								Lab Experiment Data
							</Radio>
						</Stack>
					</RadioGroup>
				</InputGroup>

				{/* Experiment Organism */}
				<InputGroup>
					<InputLeftAddon>Experiment Organism</InputLeftAddon>
					<Input
						ref={expOrganismRef}
						type='text'
						required
						list='listOrganism'
						placeholder='Choose one from dropdown or specify yours'
						value={state.experimentalOrganism}
						onChange={(e) =>
							setState((prevState) => ({
								...prevState,
								experimentalOrganism: e.target.value,
							}))
						}
					/>
					<datalist id='listOrganism' className='text-lg'>
						<option>Human</option>
						<option>Rat</option>
						<option>Mice</option>
						<option>Cell Line</option>
						<option>Other(Please specify)</option>
					</datalist>
					<InputRightAddon
						className='cursor-pointer select-none'
						onClick={handleDropdownToggle}
					>
						<GoMultiSelect className='mr-2' size={22} />
						Choose One
					</InputRightAddon>
				</InputGroup>
				{/* Tissue  */}
				<InputGroup>
					<InputLeftAddon>Tissue</InputLeftAddon>
					<Input
						ref={tissueRef}
						type='text'
						required
						list='tissueOrganism'
						placeholder='Choose one from dropdown or specify yours'
						value={state.Tissues}
						onChange={(e) =>
							setState((prevState) => ({
								...prevState,
								Tissues: e.target.value,
							}))
						}
					/>
					<datalist id='tissueOrganism' className='text-lg'>
						<option>Whole Organism</option>
						<option>Blood</option>
						<option>Serum</option>
						<option>Plasma</option>
						<option>Skin</option>
						<option>Saliva</option>
						<option>Other(Please specify)</option>
					</datalist>
					<InputRightAddon
						className='cursor-pointer select-none'
						onClick={handleDropdownToggleT}
					>
						<GoMultiSelect className='mr-2' size={22} />
						Choose One
					</InputRightAddon>
				</InputGroup>
				{/* Broad Data Type  */}
				<InputGroup>
					<InputLeftAddon>Broad Data Type</InputLeftAddon>
					<Input
						ref={bdtRef}
						type='text'
						required
						list='bdtOrganism'
						placeholder='Choose one from dropdown or specify yours'
						value={state.BroadDataTypes}
						onChange={(e) =>
							setState((prevState) => ({
								...prevState,
								BroadDataTypes: e.target.value,
							}))
						}
					/>
					<datalist id='bdtOrganism' className='text-lg'>
						<option>Molecular</option>
						<option>Biochemical</option>
						<option>Physiological</option>
						<option>Other(Please specify)</option>
					</datalist>
					<InputRightAddon
						className='cursor-pointer select-none'
						onClick={handleDropdownTogglebdtRef}
					>
						<GoMultiSelect className='mr-2' size={22} />
						Choose One
					</InputRightAddon>
				</InputGroup>
				{/* File Input */}

				<div className=''>
					<input
						className=' w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-slate-50 focus:outline-none h-[40px] pt-[7px] pl-[8px]'
						id='multiple_files'
						type='file'
						multiple
						onChange={handleFileChange}
						accept='.pdf, .jpg, .jpeg, .png, .xls, .xlsx, .txt, .doc, .docx'
						required
					/>
					<p className='text-xs'>
						Allowed files (.pdf, .jpg, .jpeg, .png, .xls, .xlsx,
						.txt, .doc, .docx)
					</p>
				</div>

				<Button
					disabled={isLoading}
					type='submit'
					colorScheme='blue'
					className={`w-full bg-blue-600 ${
						isLoading ? 'animate-bounce' : ''
					}`}
				>
					{isLoading ? 'Uploading data...' : 'Submit Data'}
				</Button>
			</form>
			<Modal
				backdrop={'static'}
				keyboard={false}
				open={open}
				onClose={handleClose}
			>
				<Modal.Header>
					<Modal.Title>
						Please keep this ID to search quickly!
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<h1 className='text-2xl'>DIP-Diary-Data ID:</h1>
					<p className='text-xl font-bold'>
						{/* @ts-ignore */}
						{resData !== null && resData.customID}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<ButtonR onClick={handleClose} appearance='primary'>
						Ok
					</ButtonR>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RDMForm;
