import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const CambioExitoso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        navigate(`/article/${id}`);
      }, 1500); // Retardo de 1.5 segundos
    }
  }, [id, navigate]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="text-center mb-2">
            <h3>Cambios guardados exitosamente</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
