// src/Router.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TaskList from '../TaskComponents/TaskList/TaskList';
// import TaskDetails from './components/TaskDetails';
// import KanbanBoard from './components/KanbanBoard';
// import TaskCalendar from './components/TaskCalendar';
// import UserProfile from './components/UserProfile';
// import LoginForm from './components/LoginForm';
// import SignUpForm from './components/SignUpForm';

const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<TaskList />} />
        {/* <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="/calendar" element={<TaskCalendar />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} /> */}
      </Routes>
  );
};

export default AppRouter;
