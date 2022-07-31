const Product = require('../models/product');

const getProducts = async (request, response) => {
  // const getAllProducts = (products) => {
  //   response.render('admin/view-products', {
  //     pageTitle: 'View Products',
  //     slug: 'view-products',
  //     hasProducts: products.length,
  //     products,
  //   });
  // };

  // Product.fetchAll(getAllProducts);

  const { user } = request.user;

  let products = [];

  try {
    // products = await Product.findAll();

    /**
     * Using the `getProducts()` association
     * method to find all products by user
    */
    products = await user.getProducts();

    response.render('admin/view-products', {
      pageTitle: 'View Products',
      slug: 'view-products',
      hasProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching products: ${error.message}`);

    response
      .status(500)
      .render('admin/view-products', {
        pageTitle: 'View Products',
        slug: 'view-products',
        hasProducts: products.length,
        products,
      });
  }
};

const getProduct = (request, response) => {
  // NOT IMPLEMENTED
  response.render('admin/view-product', {
    pageTitle: 'Product details',
    slug: 'view-products',
  });
};

const addProduct = (request, response) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add Product',
    slug: 'add-product',
    isEditMode: false
  });
};

const createProduct = async (request, response) => {
  const { title, imgUrl, description, price } = request.body;
  const { user } = request;

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    // const product = new Product(null, title, imgUrl, description, price);

    try {
      /**
       * Using the `create()` of the Product model
       * instance to create and insert a new product
       * in the database
      */
      // await Product.create({
      //   title,
      //   price,
      //   description,
      //   imageUrl: imgUrl,
      //   userId: user.id
      // });

      /**
       * When associations are created between models,
       * Sequelize automatically adds magic associations
       * methods to the model so that we can create a new
       * associated object.
       * In our case since we added the `User.hasMany(Product)`
       * association; Sequelize creates a `createProduct()`
       * method for us. Using this method will create a new
       * product in the `Product` table and will set the user
       * `id` as foreign key
      */

      await user.createProduct({
        title,
        price,
        description,
        imageUrl: imgUrl,
      });
      
      response.redirect('/');
    } catch (error) {
      console.log(`Sorry, an error occurred while saving product: ${error.message}`);
      
      response
        .status(500)
        .redirect('/');
    }
  }
};

const editProduct = async (request, response) => {
  const isEditMode =  request.query.edit;
  const productId = request.params.id;
  const user = request.user;

  if (!isEditMode) {
    return response.redirect('/admin/products');
  }

  // Product.findById(productId, (product) => {
  //   if (!product) {
  //     return response.redirect('/');
  //   }

  //   response.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     slug: 'edit-product',
  //     isEditMode: !!isEditMode,
  //     product
  //   });
  // });

  let product = null;

  try {
    // product = await Product.findByPk(productId);
    const products = await user.getProducts({ where: { id: productId } });

    product = products[0]

    if (!product) {
      return response.redirect('/');
    }

    response.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      slug: 'edit-product',
      isEditMode: !!isEditMode,
      product
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching product: ${error.message}`);

    response.redirect('/');
  }
};

const updateProduct = async (request, response) => {
  const { productId, title, imgUrl, description, price } = request.body;

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    // const updatedProduct = new Product(productId, title, imgUrl, description, price);
    try {
      const productToUpdate = await Product.findByPk(productId);

      productToUpdate.title = title;
      productToUpdate.imageUrl = imgUrl;
      productToUpdate.price = price;
      productToUpdate.description = description;


      await productToUpdate.save();

      response.redirect('/admin/products');
    } catch (error) {
      console.log(`Sorry, an error occurred while updating product: ${error.message}`);
    }
  }
};

const deleteProduct = async (request, response) => {
  const { productId } = request.body;

  /**
   * In Sequelize, there are 2 approaches to delete
   * a record. The 1st one is by using the `destroy()`
   * method provided by the model. The 2nd is by using
   * the `findbyPk()` method first and then use the
   * `destroy()` on the result return by the `findbyPk()`
   * method. In the 1st approach, we need to supply the
   * `where` option
  */

  try {
    // 1st approach
    // await Product.destroy({ where: { id: productId } });

    // 2nd approach
    const productToDelete = await Product.findByPk(productId);

    await productToDelete.destroy();

    response.redirect('/admin/products');
  } catch (error) {
    console.log(`Sorry, an error occurred while updating product: ${error.message}`);
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  createProduct,
  editProduct,
  updateProduct,
  deleteProduct,
};
