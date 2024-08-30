// src/components/Navbar.tsx
import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { useLocation } from 'react-router-dom';

const MyNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/">Task Manager</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/" active={location.pathname === '/'}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/kanban" active={location.pathname === '/kanban'}>
              Kanban Board
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/calendar" active={location.pathname === '/calendar'}>
              Calendar
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/profile" active={location.pathname === '/profile'}>
              Profile
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default MyNavbar;
