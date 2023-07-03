const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const port = process.env.PORT || 4000;
const app = express();

// Permitir CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conexión establecida con la base de datos");
});

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Configuración de multer para procesar los archivos adjuntos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//////////////////////////////////////////////////////Agregar un Articulo y subida de imagenes///////////////////////////////////////////////////////////////////////////

app.post('/add', upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  const image = req.file;

  // Verificar si se ha adjuntado un archivo
  if (!image) {
    res.status(400).json({ error: 'No se ha adjuntado ninguna imagen' });
    return;
  }

  // Generar una ruta única para la imagen
  const imageFileName = generateUniqueFileName(image.originalname);

  // Guardar la imagen en la carpeta "public" y obtener la ruta de la imagen
  const imageFilePath = saveImage(image.buffer, imageFileName);

  // Obtener la fecha y hora actual
  const currentDate = new Date();

  // Insertar la nueva publicación en la base de datos con la fecha actual
  const query = `INSERT INTO publicaciones (titulo, contenido, imagen, fechapublicacion) VALUES (?, ?, ?, ?)`;
  const values = [title, content, imageFilePath, currentDate];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al agregar la publicación' });
    } else {
      // Enviar una respuesta de éxito con un mensaje
      res.status(200).json({ message: 'Publicación y imagen subidas exitosamente' });
    }
  });
});

// Función para generar un nombre de archivo único
const generateUniqueFileName = (originalFileName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = originalFileName.split('.').pop();
  return `${timestamp}_${randomString}.${fileExtension}`;
};

// Función para guardar la imagen en la carpeta "public" y devolver la ruta de la imagen
const saveImage = (imageData, fileName) => {
  const imagePath = path.join(__dirname, 'public', fileName);

  // Guardar la imagen en la carpeta "public"
  fs.writeFile(imagePath, imageData, 'base64', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Imagen guardada: ${fileName}`);
    }
  });

  // Devolver la ruta de la imagen
  return `/public/${fileName}`;
};

// Función para borrar la imagen del servidor
const deleteImage = (fileName) => {
  const imagePath = path.join(__dirname, fileName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Imagen borrada: ${fileName}`);
    }
  });
};

/////////////////////////////////////////////////////////////////Mostrar los Articulos en la pagina principal///////////////////////////////////////////////////
// Ruta para obtener todas las publicaciones
app.get('/articles', (req, res) => {
  const query = `SELECT * FROM publicaciones`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener las publicaciones' });
    } else {
      res.status(200).json(result);
    }
  });
});

////////////////////////////////////////////////////Mostrar Articulo Completo al hacer click en el articulo en la pagina principal////////////////////////////////
// Ruta para obtener los detalles de un artículo por su ID
app.get('/article/:id', (req, res) => {
  const { id } = req.params;

  // Consultar la base de datos para obtener los detalles del artículo con el ID especificado
  const query = `SELECT * FROM publicaciones WHERE id = ?`;
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los detalles del artículo' });
    } else {
      if (result.length > 0) {
        const article = result[0];
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: 'Artículo no encontrado' });
      }
    }
  });
});

///////////////////////////////////////////////////Borrar Articulo por su ID//////////////////////////////////////////////////////////////////////////////////////////
// Ruta para borrar una publicación por su ID
app.delete('/article/:id', (req, res) => {
  const postId = req.params.id;

  // Obtener la imagen de la publicación antes de borrarla
  const query = `SELECT imagen FROM publicaciones WHERE id = ?`;
  const values = [postId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener la imagen de la publicación' });
    } else {
      const imageFileName = result[0].imagen;

      // Borrar la imagen del servidor
      deleteImage(imageFileName);

      // Borrar la publicación de la base de datos
      const deleteQuery = `DELETE FROM publicaciones WHERE id = ?`;

      db.query(deleteQuery, [postId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al borrar la publicación' });
        } else {
          res.status(200).json({ message: 'Publicación borrada exitosamente' });
        }
      });
    }
  });
});

///////////////////////////////////////////////////////////////Editar un Articulo Con o sin imagen/////////////////////////////////////////////////////////////////
app.post('/article/:id', upload.single('imagen'), (req, res) => {
  const id = req.params.id;
  const { titulo, contenido } = req.body;

  // Verificar si se ha adjuntado una nueva imagen
  if (req.file) {
    const imagen = req.file;

    // Generar un nombre de archivo único para la nueva imagen
    const nuevaImagenNombre = generateUniqueFileName(imagen.originalname);

    // Eliminar la imagen anterior si existe
    const obtenerArticuloQuery = 'SELECT imagen FROM publicaciones WHERE id = ?';

    db.query(obtenerArticuloQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error al buscar el artículo');
      }

      const article = results[0];

      if (article.imagen) {
        const imagePath = path.join(__dirname, article.imagen);
        fs.unlink(imagePath, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }

      // Guardar la nueva imagen en la carpeta "public" y obtener la ruta de la imagen
      const nuevaImagenRuta = saveImage(imagen.buffer, nuevaImagenNombre);

      // Actualizar la ruta de la imagen, el título y el contenido en el artículo
      const actualizarArticuloQuery = 'UPDATE publicaciones SET imagen = ?, titulo = ?, contenido = ? WHERE id = ?';

      db.query(actualizarArticuloQuery, [nuevaImagenRuta, titulo, contenido, id], (error) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error al guardar el artículo');
        }

        res.json({ success: true });
      });
    });
  } else {
    // No se ha adjuntado una nueva imagen, solo actualizar el título y el contenido
    const actualizarArticuloQuery = 'UPDATE publicaciones SET titulo = ?, contenido = ? WHERE id = ?';

    db.query(actualizarArticuloQuery, [titulo, contenido, id], (error) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error al guardar el artículo');
      }

      res.json({ success: true });
    });
  }
});

//////////////////////////////////////////////////Conexion al puerto//////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
