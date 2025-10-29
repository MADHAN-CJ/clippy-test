const router = require('exress').Router();
const { 
  unawaitedAsync,
  deadlockDemo,

  promiseRejectionHandling
} = require('../services/concurrencyService');


router.post('/unawaited-async', unawaitedAsync);
router.post('/deadlock', deadlockDemo);
router.get('/promise-rejection', promiseRejectionHandling);

module.exports = router;
