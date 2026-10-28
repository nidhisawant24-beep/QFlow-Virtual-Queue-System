const express = require('express');
const router = express.Router();
const {
  joinQueue,
  getTokenStatus,
  callNextCustomer,
  skipCustomer,
  removeCustomerToken,
  searchToken,
  getActiveTokens,
  getCompletedTokens,
  getCustomerHistory,
} = require('../controllers/tokenController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Customer token operations
router.post('/join', optionalAuth, joinQueue);
router.get('/my-history', protect, authorize('customer'), getCustomerHistory);
router.get('/:id/status', getTokenStatus);
router.delete('/:id', optionalAuth, removeCustomerToken);

// Business queue operations
router.post('/call-next', protect, authorize('business'), callNextCustomer);
router.post('/:id/skip', protect, authorize('business'), skipCustomer);
router.get('/search', protect, authorize('business'), searchToken);
router.get('/active/:queueId', protect, authorize('business'), getActiveTokens);
router.get('/completed/:queueId', protect, authorize('business'), getCompletedTokens);

module.exports = router;
