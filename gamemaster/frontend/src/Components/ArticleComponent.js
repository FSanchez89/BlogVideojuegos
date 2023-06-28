import React, { useState } from 'react';
import { BsTrash, BsPencil } from 'react-icons/bs';
import { format } from 'date-fns';

export const ArticleComponent = () => {
    // Artículo simulado
    const article = {
        id: 1,
        title: 'Título del artículo',
        image: 'https://picsum.photos/400/200', // Imagen simulada de Picsum
        content: 'Contenido del artículo',
        date: new Date(),
    };

    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(article.title);
    const [editedContent, setEditedContent] = useState(article.content);

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este artículo? Esta acción es irreversible.')) {
            // Aquí puedes implementar la lógica para eliminar el artículo
            console.log('Artículo eliminado');
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = () => {
        // Aquí puedes implementar la lógica para guardar los cambios realizados en el artículo
        console.log('Cambios guardados');
        setEditing(false);
    };

    const handleCancel = () => {
        setEditing(false);
        setEditedTitle(article.title);
        setEditedContent(article.content);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="text-center">
                        <h2>{editing ? <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} /> : article.title}</h2>
                        <img
                            src={article.image}
                            alt={article.title}
                            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                        />
                        <p>{editing ? <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} /> : article.content}</p>
                        <p style={{ textAlign: 'right', marginTop: '10px', fontStyle: 'italic' }}>
                            Publicado el: {format(article.date, 'dd/MM/yyyy HH:mm')}
                        </p>
                        <div className="d-flex justify-content-end">
                            {editing ? (
                                <>
                                    <button className="btn btn-primary mr-2" onClick={handleSave}>
                                        Guardar
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleCancel}>
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-danger mr-2" onClick={handleDelete}>
                                        <BsTrash />
                                    </button>
                                    <button className="btn btn-primary" onClick={handleEdit}>
                                        <BsPencil />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
