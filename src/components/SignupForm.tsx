import { Button } from '@chakra-ui/button';
import {
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
} from '@chakra-ui/input';
import { Select } from '@chakra-ui/select';

import React, { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';

import { IoMail } from 'react-icons/io5';
import {
	RiAccountPinCircleFill,
	RiLockPasswordFill,
	RiLoginCircleFill,
} from 'react-icons/ri';

import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosClient } from '../utils/axiosInstance';

type STATE = {
	email: string;
	password: string;
	fname: string;
	lname: string;
	roles: string[];
	division: string;
};
// const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const SignupForm = () => {
	const [validPassword, setValidPassword] = useState<boolean>(false);
	const navigate = useNavigate();
	const [state, setState] = useState<STATE>({
		email: '',
		password: '',
		fname: '',
		lname: '',
		roles: [],
		division: '',
	});

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const canSave = [validPassword, state.email].every(Boolean);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(state.password));
	}, [state.password]);

	// todo: make a hook for onChange events
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target;
		setState({ ...state, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// console.log(state);
		setIsLoading(true);
		const roles = Array.from(state.roles);
		// console.log(roles);
		try {
			if (canSave) {
				// do stuff
				const data = {
					fname: state.fname,
					lname: state.lname,
					roles,
					division: state.division,
					email: state.email,
					password: state.password,
				};
				const res = await axiosClient.post('/user', data);

				if (res.data?.success) {
					toast.success('Successfully created user', {
						position: 'bottom-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'light',
					});
					setIsLoading(false);
					navigate('/');
				}
			}
		} catch (error) {
			setIsLoading(false);
			console.log(error);
			toast.error(`Error: ${error}`, {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light',
			});
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		const role = localStorage.getItem('role');
		if (token) {
			navigate(`/${role}`);
		}
	}, []);
	return (
		<form
			onSubmit={handleSubmit}
			className='bg-slate-50 w-[70%] drop-shadow-lg rounded-xl mt-5'
		>
			<ToastContainer />
			<div className='flex items-center justify-between p-3 text-center bg-slate-200 rounded-t-xl'>
				<div className='flex items-center gap-2'>
					<RiLoginCircleFill size={22} />
					Create a new account
				</div>
				<div className='flex items-center gap-2'>
					<p>already have an account, </p>
					<Link
						to={'/'}
						className='flex items-center gap-2 p-2 h-[40px] text-white transition-all duration-200 ease-in-out bg-blue-700 rounded-md group hover:bg-blue-300 hover:shadow-lg'
					>
						<RiAccountPinCircleFill
							size={22}
							className='group-hover:text-blue-900'
						/>
						<h1 className='group-hover:text-blue-900'>Login</h1>
					</Link>
				</div>
			</div>
			{/* input container */}
			<div className='flex flex-col items-center justify-center w-full gap-5 p-5'>
				{/* ----------------fname--------------- */}
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<FaUserAlt color='gray.300' />
					</InputLeftElement>
					<Input
						type='text'
						name='fname'
						id='fname'
						value={state.fname}
						onChange={handleOnChange}
						placeholder='Enter your first name'
						className='pl-[40px] capitalize'
					/>
				</InputGroup>
				{/* ----------------lname--------------- */}
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<FaUserAlt color='gray.300' />
					</InputLeftElement>
					<Input
						type='text'
						name='lname'
						id='lname'
						value={state.lname}
						onChange={handleOnChange}
						placeholder='Enter your last name'
						className='pl-[40px] capitalize'
					/>
				</InputGroup>
				{/* ----------------email--------------- */}

				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<IoMail color='gray.300' />
					</InputLeftElement>
					<Input
						type='email'
						name='email'
						id='email'
						value={state.email}
						onChange={handleOnChange}
						placeholder='Enter your email address'
						className='pl-[40px]'
					/>
				</InputGroup>
				{/* ----------------role--------------- */}
				<div className='relative w-full'>
					<Select
						placeholder='Select Designation'
						className=''
						onChange={(e) => {
							const selectedRole = e.target.value;

							setState((prevState) => ({
								...prevState,
								roles: [...prevState.roles, selectedRole],
							}));
						}}
					>
						<option value='director'>Director</option>
						<option value='hod'>Head of Department (HOD)</option>
						<option value='scientist'>Scientist</option>
					</Select>
				</div>
				{/* ----------------division--------------- */}
				<div className='relative w-full'>
					<Select
						placeholder='Select Division'
						className=''
						onChange={(e) =>
							setState({ ...state, division: e.target.value })
						}
					>
						<option value='IPSS'>IPSS</option>
						<option value='OHS'>OH</option>
						<option value='AP'>AP</option>
						<option value='SP'>SP</option>
						<option value='PDT'>PDT</option>
					</Select>
				</div>
				{/* ----------------password--------------- */}
				<InputGroup>
					<InputLeftElement pointerEvents='none'>
						<RiLockPasswordFill color='gray.300' />
					</InputLeftElement>
					<Input
						type={showPassword ? 'text' : 'password'}
						name='password'
						id='password'
						autoComplete='off'
						value={state.password}
						onChange={handleOnChange}
						placeholder='Enter your password'
						className='pl-[40px]'
					/>
					<InputRightElement width='4.5rem'>
						{showPassword ? (
							<AiFillEye
								className='cursor-pointer text-black/40'
								onClick={() => setShowPassword(!showPassword)}
								size={22}
							/>
						) : (
							<AiFillEyeInvisible
								size={22}
								className='cursor-pointer text-black/40'
								onClick={() => setShowPassword(!showPassword)}
							/>
						)}
					</InputRightElement>
				</InputGroup>
				<Button
					type='submit'
					colorScheme='blue'
					className='w-full bg-blue-800'
				>
					{isLoading
						? 'Creating your account...'
						: 'Create my account'}
				</Button>
			</div>
		</form>
	);
};

export default SignupForm;
