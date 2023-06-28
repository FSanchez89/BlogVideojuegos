import React from 'react';
import { PencilSquare } from 'react-bootstrap-icons';

export const AddArticleComponent = () => {
    return (
        <div className="container mt-4">
            <h2 className="text-center">Añadir nuevo artículo</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título</label>
                    <input type="text" className="form-control" id="title" placeholder="Aquí va el título de tu post" />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Contenido</label>
                    <textarea className="form-control" id="content" rows="5" placeholder="Este es el contenido de tu post"></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Imagen</label>
                    <input type="file" className="form-control" id="image" />
                </div>
                <button type="button" className="btn btn-primary me-2">
                    Añadir imagen
                </button>
                <button type="submit" className="btn btn-primary">
                    <PencilSquare size={20} className="me-2" />
                </button>
            </form>
        </div>
    );
};
