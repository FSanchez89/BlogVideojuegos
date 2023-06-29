import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsTrash, BsPencil } from 'react-icons/bs';

export const ArticleComponent = ({ id }) => {
    const [article, setArticle] = useState([]);
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        // Obtener el artículo desde el servidor
        axios
            .get(`http://localhost:4000/article/${id}`)
            .then((response) => {
                setArticle(response.data);
                setEditedTitle(response.data.titulo);
                setEditedContent(response.data.contenido);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

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
        // Por ejemplo, podrías enviar una solicitud al servidor para guardar los cambios en la base de datos

        // Actualizar el estado del artículo con los nuevos valores editados
        setArticle((prevState) => ({
            ...prevState,
            title: editedTitle,
            content: editedContent
        }));

        setEditing(false);
    };

    const handleCancel = () => {
        setEditing(false);
        setEditedTitle(article.titulo);
        setEditedContent(article.contenido);
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="text-center">
                        <h2>{editing ? <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} /> : article.titulo}</h2>
                        <img src={article.imagen} alt={article.titulo} style={{ width: '100%', maxWidth: '400px', height: 'auto' }} />
                        <p>
                            {editing ? (
                                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                            ) : (
                                article.contenido
                            )}
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