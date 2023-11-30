const express = require('express');

const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const { router: productReviewRoute, routers: productReviewes } = require('./productReview.route');
const categoryRoute = require('./category.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');
const brandRoute = require('./brand.route');
const userRoute = require('./user.route');
const paymentRoute = require('./payment.route');
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
  {
    path: '/product/reviews',
    route: productReviewes,
  },
];

const privateRoutes = [
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/carts',
    route: cartRoute,
  },
  {
    path: '/product-review',
    route: productReviewRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/payment',
    route: paymentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

privateRoutes.forEach((route) => {
  router.use(route.path, auth(roles.user), route.route);
});

module.exports = router;
