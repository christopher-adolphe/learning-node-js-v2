const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

const getProducts = async (request, response) => {
  const { user } = request;
  let products = [];

  try {
    /**
     * Querying for products by filtering them by
     * user id so that the user only views products
     * that he/she created; meaning that the user
     * is only authorized to view products he/she
     * created
    */
    products = await Product.find({ userId: user._id });
      /**
       * Using the `select()` method to specify which document fields
       * to include or exclude. Exclusion is denoted by prefixing the 
       * field with a `-` sign
      */
      // .select('title price -_id')
      /**
       * Using the `populate()` method to specify paths which should be 
       * populated with other documents. It can also take a second parameter
       * to specify which document fields of the populated document to include
       * or exclude
      */
      // .populate('userId', 'name');

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
    isEditMode: false,
    hasError: false,
    errorMessage: null,
    errors:[],
  });
};

const createProduct = async (request, response, next) => {
  const { title, imgUrl, description, price } = request.body;
  const image = request.file;

  console.log('image: ', image);
  const { user } = request;
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      slug: 'add-product',
      isEditMode: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { title, imgUrl, description, price },
      errors: errors.array(),
    });
  }

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    try {
      const product = new Product({
        title,
        description,
        price, 
        imageUrl: imgUrl,
        userId: user,
      });
      
      await product.save();
      
      response.redirect('/');
    } catch (error) {
      console.log(`Sorry, an error occurred while saving product: ${error.message}`);
      // response
      //   .status(500)
      //   .redirect('/');

      /**
       * Instead of redirecting with a status of 500,
       * we can instantiate a new Error object using
       * the `Error()` constructor and then pass it
       * to the `next()` function. This will notify
       * express to skip all other middlewares to go
       * to a special error handling middleware
      */
      const failure = new Error(error);

      failure.httpStatusCode = 500;

      return next(failure);
    }
  }
};

const editProduct = async (request, response) => {
  const isEditMode =  request.query.edit;
  const productId = request.params.id;
  const { user } = request;

  if (!isEditMode) {
    return response.redirect('/admin/products');
  }

  let product = null;

  try {
    product = await Product.findById(productId);

    if (!product || product.userId.toString() !== user._id.toString()) {
      return response.redirect('/');
    }

    response.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      slug: 'edit-product',
      isEditMode: !!isEditMode,
      hasError: false,
      product,
      errorMessage: null,
      errors:[],
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching product: ${error.message}`);

    // response.redirect('/');
    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
  }
};

const updateProduct = async (request, response) => {
  const { productId, title, imgUrl, description, price } = request.body;
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      slug: 'edit-product',
      isEditMode: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { _id: productId, title, imageUrl: imgUrl, description, price },
      errors: errors.array(),
    });
  }

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    try {
      const productToUpdate = await Product.findById(productId);

      productToUpdate.title = title;
      productToUpdate.imageUrl = imgUrl;
      productToUpdate.price = price;
      productToUpdate.description = description;

      await productToUpdate.save();

      response.redirect('/admin/products');
    } catch (error) {
      console.log(`Sorry, an error occurred while updating product: ${error.message}`);

      const failure = new Error(error);

      failure.httpStatusCode = 500;

      return next(failure);
    }
  }
};

const deleteProduct = async (request, response) => {
  const { productId } = request.body;
  const { user } = request;

  try {
    /**
     * Using the `findByIdAndRemove()` method to delete a
     * product by filtering with a given `_id`
    */
    // const deletedProduct = await Product.findByIdAndRemove(productId);

    /**
     * Using the `deleteOne()` method to delete a
     * product so that we can authorize if the user
     * is allow to delete the product
    */
    const deletedProduct = await Product.deleteOne({ _id: productId, userId: user._id });

    response.redirect('/admin/products');
  } catch (error) {
    console.log(`Sorry, an error occurred while deleting product: ${error.message}`);

    const failure = new Error(error);

    failure.httpStatusCode = 500;

    return next(failure);
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
