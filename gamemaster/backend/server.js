const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor!');
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
