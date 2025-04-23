const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const categoryRoutes = require('./routes/categoryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config() 

const app = express()

app.use(cors());

app.use(express.json())
app.use("/public", express.static(path.join(__dirname, "public" )))

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'));


app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(process.env.PORT, () => console.log(`Server run ${process.env.PORT}`))
