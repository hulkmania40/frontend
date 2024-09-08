import React from 'react';
import AppRouter from './components/Routes/Router';
import Navbar from './components/Routes/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'reactstrap';


function App() {
  return (
    <Container fluid className='p-0'>
      <Navbar />
      <AppRouter />
    </Container>
  );
}

export default App;
