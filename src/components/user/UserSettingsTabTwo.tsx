import { Tooltip } from '@chakra-ui/react';

import React, { RefObject } from 'react';

type UserData = {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	familyName: string;
	dob: string;
	department: string;
};

type UserSettingsTabTwoProps = {
	themeMode: boolean;
	userUpdated: boolean;
	userData: UserData;
	userImageRef: RefObject<HTMLInputElement | null>;
	// eslint-disable-next-line no-unused-vars
	handleSubmit: (e: React.FormEvent) => void;
	// eslint-disable-next-line no-unused-vars
	handleOnchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	// eslint-disable-next-line no-unused-vars
	handleUserImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	imageFile: File | null;
};

const UserSettingsTabTwo: React.FC<UserSettingsTabTwoProps> = ({
	themeMode,
	userUpdated,
	userData,
	handleSubmit,
	handleOnchange,
	userImageRef,
	handleUserImageChange,
	imageFile,
}) => {
	const IMG = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

	const handleImageClick = () => {
		if (userImageRef.current) {
			userImageRef.current.click();
		}
	};

	return (
		<div className='w-[100%] md:w-[50%] p-[40px] md:p-[20px] pb-[100px] '>
			<form onSubmit={handleSubmit}>
				<h1 className='font-bold '>Update my details</h1>
				<div className='flex flex-col gap-5 mt-5'>
					<div className='flex justify-center'>
						<Tooltip label='Select an image'>
							<div
								onClick={handleImageClick}
								className='relative w-[150px] h-[150px] rounded-full cursor-pointer bg-dark-700'
							>
								<img
									src={
										imageFile
											? URL.createObjectURL(imageFile)
											: `${IMG}`
									}
									alt='Tiktern user profile image'
									className='object-cover rounded-full'
								/>
							</div>
						</Tooltip>
						<input
							type='file'
							name='image'
							id=''
							// @ts-ignore
							ref={userImageRef}
							accept='image/*'
							className='hidden'
							onChange={handleUserImageChange}
						/>
					</div>
					<input
						type='text'
						name='fname'
						id='fname'
						required
						placeholder='Enter your first name'
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.fname}
						onChange={handleOnchange}
					/>
					<input
						type='text'
						name='lname'
						id='lname'
						required
						placeholder='Enter your last name'
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.lname}
						onChange={handleOnchange}
					/>
					<input
						type='text'
						name='familyName'
						id='familyName'
						required
						placeholder='Enter your family name'
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.familyName}
						onChange={handleOnchange}
					/>
					{/* <input
						type='email'
						name='email'
						id='email'
						required
						placeholder='Enter your email address'
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.email}
						onChange={handleOnchange}
					/> */}
					<input
						type='text'
						name='phone'
						id='phone'
						required
						placeholder='Enter your phone number'
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.phone}
						onChange={handleOnchange}
					/>
					<input
						type='text'
						name='department'
						id='department'
						required
						placeholder='Enter your department'
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.department}
						onChange={handleOnchange}
					/>
					<label htmlFor='dob'>Date of birth</label>
					<input
						type='date'
						name='dob'
						id='dob'
						required
						className={`user-profile_input ${
							themeMode
								? ''
								: 'ring-offset-dark-700 ring-app-1  border-app-1'
						}`}
						value={userData.dob}
						onChange={handleOnchange}
					/>
					<button
						className={`bg-app-2 rounded-[12px] h-[50px] ring-1 ring-offset-1  ring-app-2 ${
							themeMode
								? 'text-white'
								: 'ring-offset-dark-700 text-black'
						}`}
						type='submit'
						disabled={userUpdated}
					>
						{userUpdated ? 'Updating User...' : 'Update'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default UserSettingsTabTwo;
