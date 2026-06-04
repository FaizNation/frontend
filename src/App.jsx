import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/create" element={<CreateGroup />} />
      <Route path="/groups/:id" element={<GroupDetail />} />
      <Route path="/groups/:id/edit" element={<EditGroup />} />
    </Routes>
  );
}

export default App;
