import express from 'express';
const app = express();
const port = 8005;

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('running');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
