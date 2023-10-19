import BannerImage from '../assets/imgs/banner.png';

const Header = () => {
	return (
		<header className='flex w-full h-[120px] items-center bg-slate-50 drop-shadow-md border-b border-slate-200'>
			<div className='relative w-full h-[100px]  flex '>
				<img src={BannerImage} alt='DIPAS' className='object-contain' />
			</div>
		</header>
	);
};

export default Header;
