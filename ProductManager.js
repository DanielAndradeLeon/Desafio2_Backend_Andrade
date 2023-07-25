//Curso Programación Backend 47275   
//Segundo Desafío Entregable
//Daniel Andrade

const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.products = []; // Arreglo para almacenar los productos
    this.productIdCounter = 1; // Contador para generar IDs autoincrementables
    this.path = filePath; // Ruta del archivo para el almacenamiento
    this.loadFromFile(); // Cargar los productos almacenados en el archivo
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o está vacío, no se cargarán productos iniciales.
      this.products = [];
    }
  }

  saveToFile() {
    // Convertir el arreglo de productos a formato JSON
    const data = JSON.stringify(this.products, null, 2);

    // Escribir el archivo con los datos actualizados
    fs.writeFileSync(this.path, data, 'utf8');
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar que todos los campos sean obligatorios
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // Verificar si el código ya existe en algún producto
    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      throw new Error('El código del producto ya está en uso.');
    }

    // Crear un nuevo producto con un ID autoincrementable
    const newProduct = {
      id: this.productIdCounter,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    // Incrementar el contador de IDs
    this.productIdCounter++;

    // Agregar el nuevo producto al arreglo de productos
    this.products.push(newProduct);

    // Guardar los productos en el archivo
    this.saveToFile();
  }

  getProducts() {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    return this.products;
  }

  getProductById(productId) {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Buscar el producto por ID
    const product = this.products.find((product) => product.id === productId);

    // Si no se encuentra el producto, mostrar un error en la consola
    if (!product) {
      console.error('Producto no encontrado.');
    }

    return product;
  }

  updateProduct(productId, updatedProduct) {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Buscar el índice del producto a actualizar
    const index = this.products.findIndex((product) => product.id === productId);

    // Si el producto no se encuentra, mostrar un error en la consola
    if (index === -1) {
      console.error('Producto no encontrado.');
      return;
    }

    // Actualizar el producto en el arreglo
    this.products[index] = { ...updatedProduct, id: productId };

    // Guardar los productos actualizados en el archivo
    this.saveToFile();
  }

  deleteProduct(productId) {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Filtrar los productos excluyendo el producto a eliminar
    this.products = this.products.filter((product) => product.id !== productId);

    // Guardar los productos actualizados en el archivo
    this.saveToFile();
  }
}

// Crear una instancia de ProductManager con la ruta del archivo donde se guardarán los productos
const filePath = './data/products.json'; // Ruta del archivo donde se guardarán los productos
const manager = new ProductManager(filePath);

// Agregar productos
try {
  manager.addProduct('Producto 1', 'Descripción del producto 1', 100, 'imagen1.jpg', 'code1', 10);
  manager.addProduct('Producto 2', 'Descripción del producto 2', 200, 'imagen2.jpg', 'code2', 5);
  manager.addProduct('Producto 3', 'Descripción del producto 3', 150, 'imagen3.jpg', 'code3', 8);
} catch (error) {
  console.error('Error al agregar producto:', error.message);
}

// Obtener y mostrar todos los productos
const allProducts = manager.getProducts();
console.log('Todos los productos:', allProducts);

// Obtener un producto por ID
const productId = 2;
const productById = manager.getProductById(productId);
console.log('Producto con ID', productId, ':', productById);

// Intentar obtener un producto por un ID inexistente
const nonExistentProductId = 99;
manager.getProductById(nonExistentProductId); // Se muestra el mensaje "Producto no encontrado."  


  