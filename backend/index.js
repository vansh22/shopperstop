const connectToMongo = require("./db/db");
const express = require("express");
var cors = require("cors");

// const fs = require('fs');
// const path = require('path');
// const Product = require('./models/Product');

const app = express();

app.use(cors());

connectToMongo();
const port = 5000;

app.use(express.json());

// Available routes
// http://localhost:5000/api/products/images/1.jpg
// app.use("/api/products/images", express.static("images")); // to serve the static images from backend
// http://localhost:5000/api/products/assets/Attire/attire 1.webp
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products/assets", express.static("assets")); // to serve the static images from backend
app.use("/api/products", require("./routes/products"));

// // Code to insert products into the product database
// // Generate a random price between min and max values
// const getRandomPrice = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// // Traverse through directories and extract product information
// const traverseDirectories = async (rootPath) => {
//   const files = fs.readdirSync(rootPath);

//   for (const file of files) {
//     const filePath = path.join(rootPath, file);
//     const stats = fs.statSync(filePath);

//     if (stats.isDirectory()) {
//       // If directory, continue traversing recursively
//       await traverseDirectories(filePath);
//     } else {
//       // If file, extract product information and insert into database
//       const fileName = path.basename(file, path.extname(file));
//       const folderName = path.basename(rootPath);
//       const categoryName = folderName.replace(/_/g, ' '); // Replace underscores with spaces
//       const productName = fileName.replace(/_/g, ' '); // Replace underscores with spaces
//       const imageUrl = `http://localhost:5000/api/products/assets/${folderName}/${file}`
//       const product = new Product({
//         name: productName,
//         category: categoryName,
//         image: imageUrl,
//         price: getRandomPrice(50, 150),
//       });
//       await product.save();
//       console.log(`Product inserted: ${productName}`);
//     }
//   }
// };

// // Main function to start traversing through directories
// const main = async () => {
//   const assetsPath = path.join(__dirname, 'assets');
//   await traverseDirectories(assetsPath);

//   console.log('All products inserted successfully');
//   process.exit(0); 
// };

// main();

app.listen(port, () => {
  console.log(`ShopperStop backend listening on port ${port}`);
});
