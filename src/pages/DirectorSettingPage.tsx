import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';

import React, { useEffect, useRef, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserSettingsTabContainer from '../components/user/UserSettingsTabContainer';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/theme.context';
import { axiosClient } from '../utils/axiosInstance';

type UserData = {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	familyName: string;
	dob: string;
	department: string;
};
export type CurrUserData = {
	_id: string;
	fname: string;
	lname: string;
	familyName: string;
	dob: string;
	department: string;
	phone: string;
	email: string;
	roles: string[];
	division: string[];
	rdmForm: [];
	createdAt: Date;
	updatedAt: Date;
	user_image: string;
};

const DirectorSettingPage = () => {
	const { logout } = useAuth();
	// eslint-disable-next-line no-unused-vars
	// @ts-ignore
	const { setThemeMode, themeMode } = useThemeContext();
	const userImageRef = useRef<HTMLInputElement | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	// eslint-disable-next-line no-unused-vars
	// @ts-ignore
	const [user, setUser] = useState<{} | null>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userUpdated, setUserUpdated] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData>({
		fname: '',
		lname: '',
		familyName: '',
		dob: '',
		department: '',
		email: '',
		phone: '',
	});
	const [currUser, setCurrUser] = useState<CurrUserData | null>(null);

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
				setCurrUser(res.data?.user);

				await localStorage.setItem(
					'userImage',
					res.data.user?.user_image
				);

				await localStorage.setItem('userId', res.data.user._id);

				setIsLoading(false);
				console.log(currUser);
			}
		} catch (error: any) {
			if (error.response?.data?.message === 'Invalid AT') {
				// @ts-ignore
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
			console.log('Error in fetching current user ', error);
		}
	};

	// fetching user from cookie
	useEffect(() => {
		const userCookieValue = localStorage.getItem('user');
		const getUser =
			userCookieValue && typeof userCookieValue === 'string'
				? JSON.parse(userCookieValue)
				: null;

		if (getUser !== undefined && getUser !== null) {
			setUser(getUser);
		}
	}, []);
	// handle User Image Change
	const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files !== null) {
			const file = e.target.files[0];
			setImageFile(file);
		}
	};

	// handle Onchange event
	const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	// handle submit of user update
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUserUpdated(true);
		console.log('Updating User...');
		const userId = localStorage.getItem('userId');
		const token = localStorage.getItem('token');
		try {
			if (
				typeof userId === 'string' &&
				userId !== undefined &&
				userId !== null &&
				imageFile !== null
			) {
				const formData = new FormData();
				formData.append('id', userId);
				formData.append('fname', userData.fname);
				formData.append('lname', userData.lname);
				formData.append('familyName', userData.familyName);
				formData.append('dob', userData.dob);
				formData.append('department', userData.department);
				formData.append('email', userData.email);
				formData.append('phone', userData.phone);
				formData.append(
					'user_image',
					imageFile as Blob,
					imageFile.name
				);
				const res = await axiosClient.patch('/user', formData, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				});
				if (res.data?.success) {
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
					setUserUpdated(false);
				} else {
					toast.error(`Error: ${res.data?.message}`, {
						position: 'bottom-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'colored',
					});
					setUserUpdated(false);
				}
				setUserUpdated(false);
			} else if (
				typeof userId === 'string' &&
				userId !== undefined &&
				userId !== null
			) {
				const formData = new FormData();
				formData.append('id', userId);
				formData.append('fname', userData.fname);
				formData.append('lname', userData.lname);
				formData.append('familyName', userData.familyName);
				formData.append('dob', userData.dob);
				formData.append('department', userData.department);
				formData.append('email', userData.email);
				formData.append('phone', userData.phone);
				const res = await axiosClient.patch('/user', formData, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				});
				if (res.data?.success) {
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
					setUserUpdated(false);
				}
			}
		} catch (error) {
			console.log('Error in updating the user:', error);
			setUserUpdated(false);
			toast.error(`Error: ${error}`, {
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
	};
	useEffect(() => {
		fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userUpdated]);
	return (
		<>
			{typeof window !== 'undefined' ? (
				<section
					className={`flex-1 ${
						themeMode ? 'text-black' : 'text-white'
					} `}
				>
					<ToastContainer
						position='bottom-right'
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme='colored'
					/>
					<UserSettingsTabContainer
						themeMode={themeMode}
						userUpdated={userUpdated}
						userData={userData}
						handleSubmit={handleSubmit}
						handleOnchange={handleOnchange}
						userImageRef={userImageRef}
						handleUserImageChange={handleUserImageChange}
						imageFile={imageFile}
						currUser={currUser}
						isLoading={isLoading}
					/>
				</section>
			) : (
				<div></div>
			)}
		</>
	);
};

export default DirectorSettingPage;
