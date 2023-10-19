import BannerImage from '../assets/imgs/banner.png';
import Logo from '../assets/imgs/dipas-logo.png';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
	return (
		<section className='flex flex-col items-center min-h-screen p-10'>
			<header className='flex w-full '>
				<div className='relative w-full h-[100px]  flex '>
					<img
						src={BannerImage}
						alt='DIPAS'
						className='object-contain'
					/>
				</div>
			</header>
			<section className='flex flex-col items-center w-full'>
				<h1 className='mt-5 text-2xl text-center text-black/70'>
					Welcome! Create your account
				</h1>
				{/* hero section */}
				<div className='bg-slate-50 w-[70%] drop-shadow-lg rounded-xl mt-5'>
					<div className='p-2 text-center bg-slate-200 rounded-t-xl'>
						DIP-Diary
					</div>
					<div className='flex items-center justify-center w-full p-5'>
						<div className='relative w-[100px] h-[100px] md:w-[200px] md:h-[200px]'>
							<img
								src={Logo}
								className='object-contain'
								alt='logo-DIPS'
							/>
						</div>
					</div>
				</div>
				{/* form component */}
				<SignupForm />
			</section>
		</section>
	);
};

export default SignupPage;
