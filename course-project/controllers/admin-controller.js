const Product = require('../models/product');

const getProducts = async (request, response) => {
  let products = [];

  try {
    products = await Product.find();
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
  });
};

const createProduct = async (request, response) => {
  const { title, imgUrl, description, price } = request.body;
  const { user } = request;

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
      
      response
        .status(500)
        .redirect('/');
    }
  }
};

const editProduct = async (request, response) => {
  const isEditMode =  request.query.edit;
  const productId = request.params.id;
  // const { user } = request;

  if (!isEditMode) {
    return response.redirect('/admin/products');
  }

  let product = null;

  try {
    product = await Product.findById(productId);

    if (!product) {
      return response.redirect('/');
    }

    response.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      slug: 'edit-product',
      isEditMode: !!isEditMode,
      product,
    });
  } catch (error) {
    console.log(`Sorry, an error occurred while fetching product: ${error.message}`);

    response.redirect('/');
  }
};

const updateProduct = async (request, response) => {
  const { productId, title, imgUrl, description, price } = request.body;

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
    }
  }
};

const deleteProduct = async (request, response) => {
  const { productId } = request.body;

  try {
    const deletedProduct = await Product.findByIdAndRemove(productId);

    response.redirect('/admin/products');
  } catch (error) {
    console.log(`Sorry, an error occurred while deleting product: ${error.message}`);
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
