import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import { ArticleComponent } from './ArticleComponent';

export const HomeComponent = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Obtener las publicaciones desde el servidor
    axios
      .get('http://localhost:4000/articles')
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = (id) => {
    // Eliminar el artículo con el ID proporcionado
    axios
      .delete(`http://localhost:4000/article/${id}`)
      .then((response) => {
        console.log(response.data);
        // Actualizar la lista de publicaciones después de eliminar
        setEntries(entries.filter((entry) => entry.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) {
      return content;
    } else {
      return content.substring(0, maxLength - 3) + '...';
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {entries.map((entry) => (
          <div key={entry.id} className="col-md-4 mb-4">
            <Card>
              <Link to={`/article/${entry.id}`}>
                <Card.Img variant="top" src={'http://localhost:4000' + entry.imagen} />
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
                    <div className="d-flex justify-content-between align-items-center">
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
        ))}
      </div>
    </div>
  );
};
