import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom';

export const NavbarComponent = () => {
  return (
    <>
      <Navbar expand="lg" bg="secondary" data-bs-theme="dark" >
        <Container>
          {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link text-white">Home</Link>
            <Link to="/add" className="nav-link text-white">Añadir Articulo</Link>
            <Link to="/about" className="nav-link text-white">Sobre Nosotros</Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}











