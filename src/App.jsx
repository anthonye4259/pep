import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoHome, IoCalendarOutline, IoCalendar, IoLibraryOutline, IoLibrary, IoFlaskOutline, IoFlask } from 'react-icons/io5';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Paywall from './pages/Paywall';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Library from './pages/Library';
import MyVials from './pages/MyVials';
import SyringeGuide from './pages/SyringeGuide';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ReconstitutionGuide from './pages/ReconstitutionGuide';
import Journal from './pages/Journal';
import Referrals from './pages/Referrals';

const HIDE_NAV = ['/guide', '/privacy', '/terms', '/settings', '/reconstitution-guide', '/referrals'];

function AppShell() {
  const { appState, completeOnboarding, completeAuth, completePaywall } = useApp();
  const location = useLocation();

  if (appState.step === 'onboarding') return <Onboarding onComplete={completeOnboarding} />;
  if (appState.step === 'auth') return <Auth onAuth={completeAuth} />;
  if (appState.step === 'paywall') return <Paywall onSubscribe={completePaywall} />;

  const hideNav = HIDE_NAV.includes(location.pathname);

  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/library" element={<Library />} />
        <Route path="/vials" element={<MyVials />} />
        <Route path="/guide" element={<SyringeGuide />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/reconstitution-guide" element={<ReconstitutionGuide />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/referrals" element={<Referrals />} />
      </Routes>

      {!hideNav && (
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            {({ isActive }) => (<><span className="nav-icon">{isActive ? <IoHome size={24} /> : <IoHomeOutline size={24} />}</span><span>Home</span></>)}
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (<><span className="nav-icon">{isActive ? <IoCalendar size={24} /> : <IoCalendarOutline size={24} />}</span><span>Calendar</span></>)}
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (<><span className="nav-icon">{isActive ? <IoLibrary size={24} /> : <IoLibraryOutline size={24} />}</span><span>Library</span></>)}
          </NavLink>
          <NavLink to="/vials" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (<><span className="nav-icon">{isActive ? <IoFlask size={24} /> : <IoFlaskOutline size={24} />}</span><span>My Vials</span></>)}
          </NavLink>
          <NavLink to="/journal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (<><span className="nav-icon">{isActive ? <div style={{fontWeight: 'bold', fontSize: 24}}>J</div> : <div style={{fontSize: 24}}>J</div>}</span><span>Journal</span></>)}
          </NavLink>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
