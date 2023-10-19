import { Tab } from '@headlessui/react';
import React, { Fragment, RefObject } from 'react';
import UserSettingsTabOne from './UserSettingsTabOne';
import UserSettingsTabTwo from './UserSettingsTabTwo';

type UserData = {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	familyName: string;
	dob: string;
	department: string;
};
type CurrUserData = {
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
type UserSettingsTabContainerProps = {
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
	currUser: CurrUserData | null;
	isLoading: boolean;
};
const UserSettingsTabContainer: React.FC<UserSettingsTabContainerProps> = ({
	themeMode,
	userUpdated,
	userData,
	handleSubmit,
	handleOnchange,
	userImageRef,
	handleUserImageChange,
	imageFile,
	currUser,
	isLoading,
}) => {
	return (
		<div className='w-[100%] flex flex-col  items-center transition-all ease-in-out duration-300   pt-[20px]'>
			<Tab.Group>
				<Tab.List
					className={`flex space-x-1 rounded-full  p-1 w-[90%] lg:w-[30%] ${
						themeMode ? ' bg-blue-900/10' : 'bg-white/10'
					}`}
				>
					<Tab as={Fragment}>
						{({ selected }) => (
							/* Use the `selected` state to conditionally style the selected tab. */
							<button
								className={`
                w-full rounded-full py-2.5 text-sm  leading-5 text-white-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none uppercase font-black
                ${
					selected
						? themeMode
							? 'bg-white shadow text-black'
							: 'bg-dark-800 text-white'
						: themeMode
						? ''
						: 'text-black-100 hover:bg-black/[0.12] hover:text-black'
				} transition-all ease-in-out duration-300 
            `}
							>
								My Profile
							</button>
						)}
					</Tab>
					<Tab as={Fragment}>
						{({ selected }) => (
							/* Use the `selected` state to conditionally style the selected tab. */

							<button
								className={`
                w-full rounded-full py-2.5 text-sm  leading-5 text-white-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none uppercase font-black
                ${
					selected
						? themeMode
							? 'bg-white shadow text-black'
							: 'bg-dark-800 text-white'
						: themeMode
						? ''
						: 'text-black-100 hover:bg-black/[0.12] hover:text-black'
				} transition-all ease-in-out duration-300
              `}
							>
								Update Details
							</button>
						)}
					</Tab>
				</Tab.List>
				<Tab.Panels className={`mt-2 w-full`}>
					<Tab.Panel className={``}>
						<UserSettingsTabOne
							themeMode={themeMode}
							currUser={currUser}
							isLoading={isLoading}
						/>
					</Tab.Panel>
					<Tab.Panel>
						<UserSettingsTabTwo
							themeMode={themeMode}
							userUpdated={userUpdated}
							userData={userData}
							handleSubmit={handleSubmit}
							handleOnchange={handleOnchange}
							userImageRef={userImageRef}
							handleUserImageChange={handleUserImageChange}
							imageFile={imageFile}
						/>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default UserSettingsTabContainer;
