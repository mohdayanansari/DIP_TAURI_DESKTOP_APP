import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';
import { useEffect, useState } from 'react';
import HODReportTable from '../components/HODReportTable';
import { useAuth } from '../contexts/AuthContext';
import { axiosClient } from '../utils/axiosInstance';

const HODReportsPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<{}>({});
	const { logout } = useAuth();
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
				setUserData(res.data.user);
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
	}, []);

	return (
		<section>
			<h1 className='p-2 pl-4'>
				Search all users and RDM form data {/* @ts-ignore */}
				for {isLoading ? '' : userData.division} division
			</h1>
			<hr />
			{/* @ts-ignore */}
			<HODReportTable division={isLoading ? '' : userData.division} />
		</section>
	);
};

export default HODReportsPage;
