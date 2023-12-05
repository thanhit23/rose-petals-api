const express = require('express');
const validate = require('../../middlewares/validate');
const { productReviewValidation } = require('../../validations');
const { productReviewController } = require('../../controllers/v1');
const auth = require('../../middlewares/auth');
const { roles } = require('../../config/roles');

const router = express.Router();
const routers = express.Router();

const decentralizePermissionsByQuery = async (req, res, next) => {
  const { query } = req;

  if (query.user) {
    auth(roles.user);
  }

  next();
};

routers
  .route('/')
  .get(
    validate(productReviewValidation.getReviews),
    decentralizePermissionsByQuery,
    productReviewController.getReviews
  );

router.route('/').post(validate(productReviewValidation.createReview), productReviewController.createReview);

router
  .route(`/:productReviewId`)
  .put(validate(productReviewValidation.updateReview), productReviewController.updateReview)
  .delete(validate(productReviewValidation.deleteReview), productReviewController.deleteReview);

module.exports = {
  router,
  routers,
};

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review management and retrieval
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review
 *     description: Only admins can create other reviews.
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Fashion
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Review'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
