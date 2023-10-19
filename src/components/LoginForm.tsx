import {
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
} from '@chakra-ui/input';

import React, { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { IoMail } from 'react-icons/io5';
import {
	RiAccountPinCircleFill,
	RiLockPasswordFill,
	RiLoginCircleFill,
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
// @ts-ignore
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'rsuite';
import { useAuth } from '../contexts/AuthContext';

type STATE = {
	email: string;
	password: string;
};
// const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const LoginForm = () => {
	const [validPassword, setValidPassword] = useState<boolean>(false);
	const { login } = useAuth();

	const [state, setState] = useState<STATE>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

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
		if (canSave) {
			login(state.email, state.password);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='bg-slate-50 w-[70%] drop-shadow-lg rounded-xl mt-5'
		>
			<ToastContainer />
			<div className='flex items-center justify-between p-3 text-center bg-slate-200 rounded-t-xl'>
				<div className='flex items-center gap-2'>
					<RiLoginCircleFill size={22} />
					Login
				</div>
				<div>
					<Link
						to={'/register'}
						className='flex items-center gap-2 h-[40px] p-2 text-white transition-all duration-200 ease-in-out bg-blue-700 rounded-md group hover:bg-blue-300 hover:shadow-lg'
					>
						<RiAccountPinCircleFill
							size={22}
							className='group-hover:text-blue-900'
						/>
						<h1 className='group-hover:text-blue-900'>Sign Up</h1>
					</Link>
				</div>
			</div>
			{/* input container */}
			<div className='flex flex-col items-center justify-center w-full gap-5 p-5'>
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
					appearance='primary'
					className={`bg-blue-800 w-full ${
						isLoading ? 'animate-bounce' : ''
					}`}
				>
					{isLoading ? 'Logging you in...' : 'Log In'}
				</Button>
			</div>
		</form>
	);
};

export default LoginForm;
