const { validationResult } = require('express-validator/check');
const deleteFile = require('../utils/file');

const Product = require('../models/product');

const ITEMS_PER_PAGE = 2;

const getProducts = async (request, response) => {
  const page = +request.query.page || 1;
  const { user } = request;
  let products = [];

  try {
    const productCount = await Product.find().countDocuments();
    /**
     * Querying for products by filtering them by
     * user id so that the user only views products
     * that he/she created; meaning that the user
     * is only authorized to view products he/she
     * created
    */
    products = await Product
      .find({ userId: user._id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
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
      hasNextPage: (ITEMS_PER_PAGE * +page) < productCount,
      hasPrevPage: page > 1,
      currPage: page,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(productCount / ITEMS_PER_PAGE),
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
  const { title, description, price } = request.body;

  /**
   * Accessing the `file` property on the `request` object
   * to get the uploaded file. The `multer` middleware would
   * set it to an object containing details about the file
   * that was uploaded like filename, mimetype, path etc
  */
  const image = request.file;

  // console.log('image: ', image);
  const { user } = request;
  const errors = validationResult(request);

  console.log('errors: ', errors);

  if (!image) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      slug: 'add-product',
      isEditMode: false,
      hasError: true,
      errorMessage: 'Sorry, the file uploaded was not an image',
      product: { title, description, price },
      errors: [],
    });
  }

  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      slug: 'add-product',
      isEditMode: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { title, description, price },
      errors: errors.array(),
    });
  }

  if (title.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    try {
      const product = new Product({
        title,
        description,
        price, 
        imageUrl: image.path,
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
  const { productId, title, description, price } = request.body;
  const image = request.file;
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      slug: 'edit-product',
      isEditMode: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { _id: productId, title, description, price },
      errors: errors.array(),
    });
  }

  if (title.trim() !== '' || imgUrl.trim() !== '' || description.trim() !== '' || price.trim() !== '') {
    try {
      const productToUpdate = await Product.findById(productId);

      productToUpdate.title = title;

      /**
       * Conditionally updating the `imageUrl` only
       * if a new image file was uploaded on the edit
       * product form. If `image` is not set then it
       * will mean we are keeping the previous image
       * that was uploaded when the product was created
      */
      if (image) {
        deleteFile(image.path);
        productToUpdate.imageUrl = image.path;
      }

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
    const product = await Product.findById(productId);

    if (!product) {
      return next(new Error(`Sorry, an error occurred while deleting product.`));
    }

    deleteFile(product.imageUrl);

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
