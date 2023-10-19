import { Button, Tooltip } from '@chakra-ui/react';
import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';

import { useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdArchive, MdSpaceDashboard } from 'react-icons/md';

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/theme.context';
import { axiosClient } from '../utils/axiosInstance';
import SidebarLink from './SidebarLink';

interface USER {
	fname?: string;
	lname?: string;
	phone?: string;
	email?: string;
}

const HODSidebar = () => {
	const [user, setUser] = useState<USER | null>({});
	const { logout } = useAuth();
	// eslint-disable-next-line no-unused-vars
	// @ts-ignore
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [userImg, setUserImg] = useState<string | null | false>('');

	const handleLogout = async () => {
		logout();
		let permissionGranted = await isPermissionGranted();
		if (!permissionGranted) {
			const permission = await requestPermission();
			permissionGranted = permission === 'granted';
		}
		if (permissionGranted) {
			sendNotification({
				title: 'DIP',
				body: 'User logged out successfully!',
			});
		}
	};

	const fetchUser = async () => {
		setIsLoading(true);
		const token = await localStorage.getItem('token');
		try {
			const res = await axiosClient.get('/user/curr-user', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.data.success) {
				localStorage.setItem('userImage', res.data.user?.user_image);
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
			console.log('Error in fetching current user ', error);
		}
	};

	useEffect(() => {
		const img = localStorage.getItem('userImage');
		setIsLoading(true);
		fetchUser();
		const userValue = localStorage.getItem('user');

		const getUser =
			userValue && typeof userValue === 'string'
				? JSON.parse(userValue)
				: null;

		if (getUser !== undefined && getUser !== null) {
			setUser(getUser);
			setIsLoading(false);
		}
		setUserImg(img);
		// console.log(userImg);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userImg]);

	const { setThemeMode, themeMode } = useThemeContext();

	return (
		<aside
			className={`w-[300px]  min-h-[calc(100vh-120px)] relative drop-shadow-xl ${
				themeMode ? 'bg-slate-50 text-black ' : 'bg-dark-800 text-white'
			} !z-50 flex flex-col justify-between`}
		>
			<div>
				{/* logo */}
				<div className='flex items-center justify-center py-5 min-h-fit'>
					<h1 className='text-xl font-black text-center'>
						Welcome, {user && user.fname}
					</h1>
				</div>
				{/* ***************profile--section*********** */}
				<div className='flex flex-col items-center justify-center gap-2 min-h-fit'>
					{/* avatar */}
					<div
						className={`relative w-[80px] h-[80px] flex items-center justify-center rounded-full ${
							themeMode ? 'text-black/90' : 'text-black'
						} bg-app-1 font-bold`}
					>
						{userImg ? (
							<img
								src={`https://dip-server-w83b.onrender.com/uploads/profile-images/${userImg}`}
								alt='tiktern user image'
								loading='lazy'
								className='object-cover rounded-full'
							/>
						) : (
							<h1 className={`text-3xl text-black/80`}>
								{user && user.fname
									? user.fname
											.replace(/\W*(\w)\w*/g, '$1')
											.toUpperCase()
									: '😀'}
							</h1>
						)}
					</div>
					{/* name */}
					<div className='text-xl'>
						{`${user && user.fname ? user.fname : 'User'} ${
							user && user.lname !== undefined ? user.lname : ''
						}`}
					</div>
					<Link
						to={'/hod/hod-settings'}
						className={`border  outline-none rounded-full w-[50px] text-xs h-[30px] cursor-pointer  transition-all duration-300 ease-in-out flex justify-center items-center ${
							themeMode
								? 'border-black/30 text-black/50 hover:border-white hover:bg-app-2 hover:text-white'
								: 'border-white/30 text-white/50 hover:bg-app-2 hover:text-white'
						}`}
					>
						Edit
					</Link>
				</div>
				{/* links */}
				<div className='min-h-fit px-[30px] pt-5 flex flex-col gap-2 '>
					{PATHS.map((item, index) => (
						<SidebarLink
							key={index}
							link={item.link}
							name={item.name}
							themeMode={themeMode}
						>
							{item.icon()}
						</SidebarLink>
					))}
				</div>
			</div>
			{/* footer */}
			<div className='min-h-fit flex flex-col gap-5 items-center justify-center pb-5 px-[30px]'>
				<Tooltip hasArrow label='Logout' placement='right'>
					<Button
						rightIcon={<IoLogOutOutline size={22} />}
						onClick={handleLogout}
						className={`w-full h-[50px]  font-light transition-all duration-300 ease-in-out rounded-2xl hover:scale-95 border  flex justify-center items-center hover:text-black ${
							themeMode
								? ' text-dark-300'
								: 'text-light-300 border-white/30'
						}`}
					>
						Logout
					</Button>
				</Tooltip>
				<div className='flex items-center gap-2'>
					<input
						id='toggle-custom'
						className='toggle-custom'
						type='checkbox'
						checked={themeMode}
						onChange={() => setThemeMode(!themeMode)}
					/>
					<label
						htmlFor='toggle-custom'
						className='text-xs title opacity-80'
					>
						{themeMode
							? 'Switch to Dark Mode'
							: 'Switch to Light Mode'}
					</label>
				</div>
			</div>
		</aside>
	);
};

const PATHS = [
	{
		name: 'Submit Data',
		link: '/hod',
		icon: () => <MdSpaceDashboard />,
	},
	{
		name: 'Reports',
		link: '/hod/hod-reports',
		icon: () => <MdSpaceDashboard />,
	},
	{
		name: 'Archive',
		link: '/hod/hod-history',
		icon: () => <MdArchive />,
	},
	{
		name: 'Setting',
		link: '/hod/hod-settings',
		icon: () => <AiFillSetting />,
	},
];
export default HODSidebar;
