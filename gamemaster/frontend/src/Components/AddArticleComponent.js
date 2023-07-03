import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilSquare } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const AddArticleComponent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false); // Estado para verificar si la publicación se ha subido con éxito
  const [error, setError] = useState(false); // Estado para verificar si hubo un error en la subida

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === '' || content.trim() === '' || image === null) {
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    axios
      .post('http://localhost:4000/add', formData)
      .then((response) => {
        console.log(response.data);
        setIsUploaded(true); // Cambiar el estado para mostrar el mensaje de éxito
        setShowModal(true); // Mostrar el modal con el mensaje de éxito
      })
      .catch((error) => {
        console.error(error);
        setError(true); // Hubo un error en la subida
        setShowModal(true); // Mostrar el modal con el mensaje de error
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isUploaded) {
      window.location.href = '/'; // Redirigir al home después de cerrar el modal en caso de éxito
    }
  };

  useEffect(() => {
    if (showModal && (isUploaded || error)) {
      const timer = setTimeout(() => {
        handleCloseModal();
      }, 2000); // Cerrar el modal automáticamente después de 2 segundos (ajusta el tiempo según tus necesidades)
      return () => clearTimeout(timer);
    }
  }, [showModal, isUploaded, error]);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Añadir nuevo artículo</h2>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Aquí va el título de tu post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Contenido
          </label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            placeholder="Este es el contenido de tu post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Imagen
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="mb-3 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            <PencilSquare size={20} />
          </button>
        </div>
      </form>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUploaded ? 'Publicación Subida con Éxito' : 'Error al Agregar la Publicación'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isUploaded
            ? '¡Tu publicación ha sido subida con éxito! Serás redirigido a la página principal automáticamente.'
            : 'Ha ocurrido un error al agregar la publicación. Por favor, verifica que hayas ingresado un título, contenido e imagen válidos.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
