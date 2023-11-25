const express = require('express');
const validate = require('../../middlewares/validate');
const { orderValidation, orderDetailValidation } = require('../../validations/v1');
const { orderController, orderDetailController } = require('../../controllers/v1');

const router = express.Router();

router
  .route('/')
  .post(validate(orderValidation.createOrder), orderController.createOrder)
  .get(validate(orderValidation.getOrders), orderController.getOrders);

router
  .route(`/:orderId`)
  .get(validate(orderValidation.getOrder), orderController.getOrder)
  .put(validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(validate(orderValidation.deleteOrder), orderController.deleteOrder);

router.route('/detail').post(validate(orderDetailValidation.createOrder), orderDetailController.createOrder);

router
  .route(`/:orderId/detail`)
  .get(validate(orderDetailValidation.getOrders), orderDetailController.getListOrderByOrderId)
  .put(validate(orderDetailValidation.updateOrder), orderDetailController.updateOrder)
  .delete(validate(orderDetailValidation.deleteOrder), orderDetailController.deleteOrder);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management and retrieval
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a order
 *     description: Only admins can create other orders.
 *     tags: [Order]
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
 *                $ref: '#/components/schemas/Brand'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
