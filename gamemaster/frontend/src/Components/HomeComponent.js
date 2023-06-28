import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import { es } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

export const HomeComponent = () => {
  // Mock data para las entradas
  const entries = [
    { id: 1, title: 'Entrada 1', content: 'Contenido de la Entrada 1', date: new Date() },
    { id: 2, title: 'Entrada 2', content: 'Contenido de la Entrada 2', date: new Date() },
    { id: 3, title: 'Entrada 3', content: 'Contenido de la Entrada 3', date: new Date() },
    { id: 4, title: 'Entrada 4', content: 'Contenido de la Entrada 4', date: new Date() },
    { id: 5, title: 'Entrada 5', content: 'Contenido de la Entrada 5', date: new Date() },
    { id: 6, title: 'Entrada 6', content: 'Contenido de la Entrada 6', date: new Date() },
  ];

  const handleDelete = (id) => {
    // Aquí puedes implementar la lógica para eliminar el artículo con el ID proporcionado
    console.log(`Eliminando artículo con ID: ${id}`);
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
                <Card.Img
                  variant="top"
                  src={`https://picsum.photos/200/150/?random=${entry.id}`}
                  alt={entry.title}
                />
              </Link>
              <section>
                <Card.Body>
                  <article>
                    <Card.Title>
                      <Link to={`/article/${entry.id}`} className="card-link nav-link text-black">
                        {entry.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>{truncateContent(entry.content, 50)}</Card.Text>
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
                      <p className="text-muted">{formatDistanceToNow(entry.date, { locale: es, addSuffix: true })}</p>
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
