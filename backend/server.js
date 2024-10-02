const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router=require('./routers/route');
const app = express();

app.use(cors());
app.use('/uploads', express.static("../backend/database/uploads"));
app.use(express.json());

app.use(morgan('dev'));

app.use('/api',router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});