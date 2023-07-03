import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsTrash, BsPencil, BsSave, BsX } from 'react-icons/bs';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const ArticleComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    const getArticleById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:4000/article/${id}`);
        const formattedArticle = {
          ...response.data,
          fechaPublicacion: formatDate(response.data.fechaPublicacion),
        };
        setArticle(formattedArticle);
        setEditedTitle(formattedArticle.titulo);
        setEditedContent(formattedArticle.contenido);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getArticleById(id);
  }, [id]);

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedDate = new Date(date).toLocaleDateString('es-ES', options);

    return formattedDate;
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas eliminar este artículo? Esta acción es irreversible.'
      )
    ) {
      try {
        await axios.delete(`http://localhost:4000/article/${id}`);
        setShowDeleteModal(false); // Ocultar modal de confirmación de eliminación
        navigate('/'); // Redirige a la página principal
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (editedTitle.trim() === '' || editedContent.trim() === '') {
      setShowErrorModal(true); // Mostrar modal de error
      return;
    }

    const formData = new FormData();
    formData.append('titulo', editedTitle);
    formData.append('contenido', editedContent);
    if (editedImage) {
      formData.append('imagen', editedImage);
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/article/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSavedSuccessfully(true);
      const formattedArticle = {
        ...response.data,
        fechaPublicacion: formatDate(response.data.fechaPublicacion),
      };
      setArticle(formattedArticle);
      setEditing(false);
      setEditedImage(null);
      navigate(`/article/${id}`); // Redirige a la ruta del artículo
      navigate(`/cambio-exitoso/${id}`); // Redirige a CambioExitoso con el ID del artículo
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedTitle(article.titulo);
    setEditedContent(article.contenido);
    setEditedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedImage(file);
  };

  const handleRemoveImage = () => {
    setEditedImage(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const paragraphs = editedContent.split('\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));

  const formattedPublicationDate = formatDate(article.fechapublicacion);

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="text-center mb-2">
            {editing ? (
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                style={{ marginTop: '20px', width: '100%', fontSize: '24px' }}
              />
            ) : (
              <h2 style={{ marginTop: '20px' }}>{editedTitle}</h2>
            )}
            {editing ? (
              <div>
                <div>
                  {editedImage ? (
                    <div>
                      <img
                        src={
                          editedImage instanceof File
                            ? URL.createObjectURL(editedImage)
                            : editedImage
                        }
                        alt="Preview"
                        className="img-fluid"
                        style={{
                          width: '100%',
                          maxWidth: '800px',
                          height: 'auto',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      />
                      <button onClick={handleRemoveImage} className="btn btn-link">
                        <BsX />
                      </button>
                    </div>
                  ) : (
                    <img
                      src={'http://localhost:4000' + article.imagen}
                      className="img-fluid"
                      style={{
                        width: '100%',
                        maxWidth: '800px',
                        height: 'auto',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                      alt="Article Image"
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <img
                src={'http://localhost:4000' + article.imagen}
                className="img-fluid"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  marginTop: '10px',
                  marginBottom: '10px',
                }}
                alt="Article Image"
              />
            )}
            <div style={{ textAlign: 'justify' }}>
              {editing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  style={{ height: '300px', marginTop: '10px', width: '100%' }}
                  className="form-control"
                />
              ) : (
                <div>{paragraphs}</div>
              )}
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <p style={{ marginBottom: '5px' }}>
                Fecha de publicación: {formattedPublicationDate}
              </p>
            </div>
            {editing ? (
              <div className="d-flex justify-content-end align-items-center mt-3 mb-3">
                <button className="btn btn-primary mr-2" onClick={handleSave} style={{ marginRight: '5px' }}>
                  <BsSave />
                </button>
                <button className="btn btn-danger" onClick={handleCancel}>
                  <BsX />
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-end align-items-center mt-3 mb-3">
                <button className="btn btn-primary mr-2" onClick={handleEdit} style={{ marginRight: '5px' }}>
                  <BsPencil />
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                  <BsTrash />
                </button>
              </div>
            )}
          </div>
          {savedSuccessfully && (
            <div className="alert alert-success">
              Cambios guardados exitosamente.
            </div>
          )}
        </div>
      </div>

      {/* Modal para confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este artículo? Esta acción es irreversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para alerta de campos obligatorios */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El título y el contenido son obligatorios.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseErrorModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
