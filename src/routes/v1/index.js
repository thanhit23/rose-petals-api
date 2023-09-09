const express = require('express');

const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const brandRoute = require('./brand.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/brands',
    route: brandRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
