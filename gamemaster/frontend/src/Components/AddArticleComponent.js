import React, { useState } from 'react';
import axios from 'axios';
import { PencilSquare } from 'react-bootstrap-icons';

export const AddArticleComponent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    axios
      .post('http://localhost:4000/add', formData)
      .then((response) => {
        console.log(response.data);
        // Realizar acciones adicionales después de enviar el formulario, como redirigir o mostrar un mensaje de éxito
        alert('Publicación y imagen subidas exitosamente');
        window.location.href = '/'; // Redirigir al home
      })
      .catch((error) => {
        console.error(error);
        // Manejar errores en caso de que la solicitud no sea exitosa
        alert('Error al agregar la publicación');
      });
  };

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
            <PencilSquare size={20} className="me-2" />
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
};
