import { Route, Routes } from 'react-router-dom';
import DirectorLayout from './layouts/DirectorLayout';
import HODLayout from './layouts/HODLayout';
import ScientistLayout from './layouts/ScientistLayout';
import DirectorHistoryPage from './pages/DirectorHistoryPage';
import DirectorPage from './pages/DirectorPage';
import DirectorReportsPage from './pages/DirectorReportsPage';
import DirectorSettingPage from './pages/DirectorSettingPage';
import HODHistoryPage from './pages/HODHistoryPage';
import HODPage from './pages/HODPage';
import HODReportsPage from './pages/HODReportsPage';
import HODSettingPage from './pages/HODSettingPage';
import LoginForm from './pages/LoginPage';
import ScientistHistoryPage from './pages/ScientistHistoryPage';
import ScientistPage from './pages/ScientistPage';
import ScientistSettings from './pages/ScientistSettingPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './routes/PrivateRoutes';
import { ROLE } from './utils/roles';

function App() {
	return (
		<Routes>
			<Route path='/' element={<LoginForm />} />
			<Route path='/register' element={<SignupPage />} />
			{/* --------- Scientist_Page -------- */}
			<Route
				path='/scientist'
				element={
					<PrivateRoute roles={[ROLE.scientist]}>
						<ScientistLayout />
					</PrivateRoute>
				}
			>
				<Route
					path='/scientist'
					element={
						<PrivateRoute roles={[ROLE.scientist]}>
							<ScientistPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/scientist/scientist-history'
					element={
						<PrivateRoute roles={[ROLE.scientist]}>
							<ScientistHistoryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/scientist/scientist-settings'
					element={
						<PrivateRoute roles={[ROLE.scientist]}>
							<ScientistSettings />
						</PrivateRoute>
					}
				/>
			</Route>
			{/* --------- HOD_Page -------- */}
			<Route
				path='/hod'
				element={
					<PrivateRoute roles={[ROLE.hod]}>
						<HODLayout />
					</PrivateRoute>
				}
			>
				<Route
					path='/hod'
					element={
						<PrivateRoute roles={[ROLE.hod]}>
							<HODPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/hod/hod-history'
					element={
						<PrivateRoute roles={[ROLE.hod]}>
							<HODHistoryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/hod/hod-reports'
					element={
						<PrivateRoute roles={[ROLE.hod]}>
							<HODReportsPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/hod/hod-settings'
					element={
						<PrivateRoute roles={[ROLE.hod]}>
							<HODSettingPage />
						</PrivateRoute>
					}
				/>
			</Route>

			{/* --------- Director_Page -------- */}
			<Route
				path='/director'
				element={
					<PrivateRoute roles={[ROLE.director]}>
						<DirectorLayout />
					</PrivateRoute>
				}
			>
				<Route
					path='/director'
					element={
						<PrivateRoute roles={[ROLE.director]}>
							<DirectorPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/director/director-history'
					element={
						<PrivateRoute roles={[ROLE.director]}>
							<DirectorHistoryPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/director/director-reports'
					element={
						<PrivateRoute roles={[ROLE.director]}>
							<DirectorReportsPage />
						</PrivateRoute>
					}
				/>
				<Route
					path='/director/director-settings'
					element={
						<PrivateRoute roles={[ROLE.director]}>
							<DirectorSettingPage />
						</PrivateRoute>
					}
				/>
			</Route>
		</Routes>
	);
}

export default App;
