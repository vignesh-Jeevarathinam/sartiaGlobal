const express = require('express');
const bookController = require('../controllers/bookController');
const { authorizeUser } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');



const router = express.Router();

//admin CRUD routes
router.get('/', bookController.getAllBooks);
router.post('/',authorizeUser('admin'), bookController.createBook);
router.put('/:id',authorizeUser('admin'), bookController.updateBook);
router.delete('/:id',authorizeUser('admin'), bookController.deleteBook);

//super admin approve & reject routes
router.put('/books/approve/:id',  authorizeUser('superadmin'), bookController.approveBook);
router.put('/books/reject/:id',  authorizeUser('superadmin'), bookController.rejectBook);

//user purchase route
router.post('/purchase',authorizeUser('user') , userController.purchaseBook);

module.exports = router;
