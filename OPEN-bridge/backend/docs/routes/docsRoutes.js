const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');
const { validateCreateDoc, validateUpdateDoc } = require('../validators/docsValidators');
const authController = require('../../auth/controllers/authController');

// GET /api/docs - Get documentation with filters
router.get('/', docsController.getDocs);

// GET /api/docs/search - Search documentation
router.get('/search', docsController.searchDocs);

// GET /api/docs/:id - Get specific documentation
router.get('/:id', docsController.getDoc);

// All routes below require authentication
router.use(authController.authenticate);

// POST /api/docs - Create new documentation (admin only)
router.post('/', (req, res, next) => {
  const { error } = validateCreateDoc(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}, docsController.createDoc);

// PUT /api/docs/:id - Update documentation (admin only)
router.put('/:id', (req, res, next) => {
  const { error } = validateUpdateDoc(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
}, docsController.updateDoc);

// DELETE /api/docs/:id - Delete documentation (admin only)
router.delete('/:id', docsController.deleteDoc);

module.exports = router;