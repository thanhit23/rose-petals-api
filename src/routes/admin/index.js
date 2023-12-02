const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const brandRoute = require('./brand.route');
const orderRoute = require('./order.route');
const analyticRoute = require('./analytic.route');
const productReviewRoute = require('./productReview.route');
const auth = require('../../middlewares/auth');
const { roles } = require('../../config/roles');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

const privateRoutes = [
  {
    path: '/users',
    route: userRoute,
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
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/product-reviews',
    route: productReviewRoute,
  },
  {
    path: '/analytics',
    route: analyticRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

privateRoutes.forEach((route) => {
  router.use(route.path, auth(roles.admin), route.route);
});

module.exports = router;
