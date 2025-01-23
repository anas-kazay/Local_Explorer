import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { ActivityProvider } from './context/AcitivityContext';
import FavoriteActivities from './components/FavoriteActivities';

function App() {
  return (
    <ActivityProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/favorites"
              element={<FavoriteActivities />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </ActivityProvider>
  );
}

export default App;
