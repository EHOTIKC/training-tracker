import express, { Application } from 'express';
import cors from 'cors';
import productRouter from './routers/product.router';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', productRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is successfully running on http://localhost:${PORT}`);
});