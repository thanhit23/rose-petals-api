const express = require('express');

const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const cartRoute = require('./cart.route');
const brandRoute = require('./brand.route');
const userRoute = require('./user.route');
const orderRoute = require('./order.route');
const auth = require('../../middlewares/auth');
const { roles } = require('../../config/roles');

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

const privateRoutes = [
  {
    path: '/carts',
    route: cartRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

privateRoutes.forEach((route) => {
  router.use(route.path, auth(roles.user), route.route);
});

module.exports = router;
