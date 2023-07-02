import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsTrash, BsPencil } from 'react-icons/bs';
import { useParams, useNavigate } from 'react-router-dom';

export const ArticleComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedImage, setEditedImage] = useState(null);
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
        window.alert('Artículo borrado exitosamente');
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
      alert('El título y el contenido son obligatorios');
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="text-center mb-2">
            {editing ? (
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <h2>{editedTitle}</h2>
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
                        style={{
                          width: '100%',
                          maxWidth: '800px',
                          height: 'auto',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      />
                      <button onClick={handleRemoveImage}>Remove Image</button>
                    </div>
                  ) : (
                    <img
                      src={'http://localhost:4000' + article.imagen}
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
                <button className="btn btn-primary mr-2" onClick={handleSave}>
                  Guardar
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-end align-items-center mt-3 mb-3">
                <button className="btn btn-primary mr-2" onClick={handleEdit}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Eliminar
                </button>
              </div>
            )}
            {savedSuccessfully && (
              <div className="alert alert-success" role="alert">
                ¡Cambios guardados exitosamente!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
