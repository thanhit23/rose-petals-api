const express = require('express');
const validate = require('../../middlewares/validate');
const { brandValidation } = require('../../validations');
const { brandController } = require('../../controllers/admin');

const router = express.Router();
router
  .route('/')
  .post(validate(brandValidation.createBrand), brandController.createBrand)
  .get(validate(brandValidation.getBrands), brandController.getBrands);

router.route('/all').get(validate(brandValidation.getAllBrands), brandController.getAllBrands);

router
  .route(`/:brandId`)
  .get(validate(brandValidation.getBrand), brandController.getBrand)
  .put(validate(brandValidation.updateBrand), brandController.updateBrand)
  .delete(validate(brandValidation.deleteBrand), brandController.deleteBrand);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: Brand management and retrieval
 */

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create a brand
 *     description: Only admins can create other brands.
 *     tags: [Brand]
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
