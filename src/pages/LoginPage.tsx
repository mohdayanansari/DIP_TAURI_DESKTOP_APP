import Logo from '../assets/imgs/dipas-logo.png';
import LoginForm from '../components/LoginForm';
import Header from '../layouts/Header';

const LoginPage = () => {
	return (
		<main className='flex flex-col items-center min-h-screen px-10'>
			<Header />
			<section className='flex flex-col items-center w-full'>
				<h1 className='mt-5 text-4xl text-center text-black/70'>
					Welcome!
				</h1>
				{/* hero section */}
				<div className='bg-slate-50 w-[70%] drop-shadow-lg rounded-xl mt-5'>
					<div className='p-2 text-center bg-slate-200 rounded-t-xl'>
						DIP-Diary
					</div>
					<div className='flex items-center justify-center w-full p-5'>
						<div className='relative w-[200px] h-[200px] md:w-[300px] md:h-[300px]'>
							<img
								src={Logo}
								className='object-contain'
								alt='logo-DIPS'
							/>
						</div>
					</div>
				</div>
				{/* form component */}
				<LoginForm />
			</section>
		</main>
	);
};

export default LoginPage;
