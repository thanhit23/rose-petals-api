const express = require('express');
const validate = require('../../middlewares/validate');
const { categoryValidation } = require('../../validations');
const { categoryController } = require('../../controllers/admin');

const router = express.Router();
router
  .route('/')
  .post(validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(validate(categoryValidation.getCategories), categoryController.getCategories);

router.route('/all').get(validate(categoryValidation.getAllCategories), categoryController.getAllCategories);

router
  .route(`/:categoryId`)
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .put(validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

router.route('/name/:slug').get(validate(categoryValidation.getCategoryBySlug), categoryController.getCategoryBySlug);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management and retrieval
 */

/**
 * @swagger
 * /categorys:
 *   post:
 *     summary: Create a category
 *     description: Only admins can create other categorys.
 *     tags: [Category]
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
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
