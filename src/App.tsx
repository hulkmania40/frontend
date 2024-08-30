import React from 'react';
import AppRouter from './components/Routes/Router';
import Navbar from './components/Routes/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div>
      <Navbar />
      <AppRouter />
    </div>
  );
}

export default App;
