import moment from 'moment';

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
type Props = {
	themeMode: boolean;
	currUser: CurrUserData | null;
	isLoading: boolean;
};

const UserSettingsTabOne = ({ themeMode, currUser, isLoading }: Props) => {
	return (
		<div className='p-[50px]'>
			{isLoading ? (
				<div className='flex items-center justify-center text-2xl font-bold text-center animate-pulse text-app-2'>
					Loading....
				</div>
			) : (
				<div>
					{currUser !== null && currUser !== undefined ? (
						<div>
							<div className='flex justify-center'>
								<div
									className={`relative w-[200px] h-[200px] rounded-full drop-shadow-lg ring-4 ring-app-2 ring-offset-4 ${
										themeMode
											? 'ring-offset-white'
											: 'ring-offset-dark-800'
									}`}
								>
									<img
										src={`https://dip-server-w83b.onrender.com/uploads/profile-images/${currUser.user_image}`}
										alt={`Tiktern User: ${
											currUser.fname + currUser.lname
										}`}
										className='object-cover rounded-full'
									/>
								</div>
							</div>
							<div
								className={`flex flex-col gap-5 text-sm md:text-xl ${
									themeMode ? 'text-black' : 'text-white'
								} items-center mt-[50px]`}
							>
								<div>
									<span className='font-black'>Name: </span>
									{currUser.fname
										? currUser.fname
										: 'Not found!'}{' '}
									{currUser.lname
										? currUser.lname
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Family Name:{' '}
									</span>

									{currUser.familyName
										? currUser.familyName
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Date of Birth:{' '}
									</span>
									{currUser.dob
										? moment(currUser.dob).format(
												'MMMM Do YYYY'
										  )
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Department:{' '}
									</span>

									{currUser.department
										? currUser.department
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Division:{' '}
									</span>

									{currUser.division[0]
										? currUser.division[0]
										: 'Not found!'}
								</div>
								<div className='capitalize'>
									<span className='font-black '>
										Designation:{' '}
									</span>

									{currUser.roles[0]
										? currUser.roles[0]
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>Email: </span>

									{currUser.email
										? currUser.email
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Phone Number:{' '}
									</span>

									{currUser.phone
										? currUser.phone
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Account Created:{' '}
									</span>
									{currUser.createdAt
										? moment(currUser.createdAt).format(
												'MMMM Do YYYY, h:mm:ss a'
										  )
										: 'Not found!'}
								</div>
								<div>
									<span className='font-black'>
										Account Updated:{' '}
									</span>
									{currUser.updatedAt
										? moment(currUser.updatedAt).format(
												'MMMM Do YYYY, h:mm:ss a'
										  )
										: 'Not found!'}
								</div>
							</div>
						</div>
					) : (
						<div>User Not Found!</div>
					)}
				</div>
			)}
		</div>
	);
};

export default UserSettingsTabOne;
