const express = require('express');

const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const productReviewRoute = require('./productReview.route');
const categoryRoute = require('./category.route');
const cartRoute = require('./cart.route');
const brandRoute = require('./brand.route');
const userRoute = require('./user.route');
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
    path: '/product-reviews',
    route: productReviewRoute,
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

privateRoutes.forEach((route) => {
  router.use(route.path, auth(roles.user), route.route);
});

module.exports = router;
