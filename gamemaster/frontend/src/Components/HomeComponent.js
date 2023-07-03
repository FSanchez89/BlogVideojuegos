import React, { useState, useEffect } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsTrash, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import ReactPaginate from 'react-paginate';

export const HomeComponent = () => {
  const [entries, setEntries] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const entriesPerPage = 12;
  const pagesVisited = currentPage * entriesPerPage;

  useEffect(() => {
    // Obtener las publicaciones desde el servidor y ordenarlas por fecha de publicación (de más nueva a más antigua)
    axios
      .get('http://localhost:4000/articles')
      .then((response) => {
        const sortedEntries = response.data.sort((a, b) => new Date(b.fechapublicacion) - new Date(a.fechapublicacion));
        setEntries(sortedEntries);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Eliminar el artículo con el ID proporcionado
    axios
      .delete(`http://localhost:4000/article/${deleteId}`)
      .then((response) => {
        console.log(response.data);
        // Actualizar la lista de publicaciones después de eliminar
        setEntries(entries.filter((entry) => entry.id !== deleteId));
        handleCloseModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) {
      return content;
    } else {
      return content.substring(0, maxLength - 3) + '...';
    }
  };

  const displayEntries = entries
    .slice(pagesVisited, pagesVisited + entriesPerPage)
    .map((entry) => (
      <div key={entry.id} className="col-md-4 mb-5"> {/* Cambio de col-md-4 a col-md-6 */}
        <Card className="h-100">
          <Link to={`/article/${entry.id}`}>
            <Card.Img
              variant="top"
              src={'http://localhost:4000' + entry.imagen}
              style={{ objectFit: 'cover', height: '200px' }} // Ajustar la imagen al ancho total de la tarjeta
            />
          </Link>
          <section>
            <Card.Body>
              <article>
                <Card.Title>
                  <Link to={`/article/${entry.id}`} className="card-link nav-link text-black">
                    {entry.titulo}
                  </Link>
                </Card.Title>
                <Card.Text>{truncateContent(entry.contenido, 50)}</Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-2"> {/* Cambio a flexbox */}
                  <div>
                    <Link to={`/article/${entry.id}`} className="btn btn-primary">
                      Ver más
                    </Link>{' '}
                    <button
                      className="btn btn-danger"
                      style={{ marginRight: '2px' }}
                      onClick={() => handleDelete(entry.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                  <p className="text-muted">
                    <ReactTimeAgo date={new Date(entry.fechapublicacion)} />
                  </p>
                </div>
              </article>
            </Card.Body>
          </section>
        </Card>
      </div>
    ));

  const pageCount = Math.ceil(entries.length / entriesPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mt-4">
      <div className="row">{displayEntries}</div>
      <ReactPaginate
        previousLabel={<BsChevronLeft />} // Reemplazar "Anterior" por la flecha hacia la izquierda
        nextLabel={<BsChevronRight />} // Reemplazar "Siguiente" por la flecha hacia la derecha
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName="pagination"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageClassName="page-item" // Estilo para el número de página
        pageLinkClassName="page-link" // Estilo para el enlace del número de página
        activeLinkClassName="active" // Estilo para el número de página activo
        disabledClassName="disabled"
        activeClassName="active"
      />

      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
