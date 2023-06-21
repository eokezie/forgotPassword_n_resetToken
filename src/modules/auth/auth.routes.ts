import express from 'express';
import {
    signupController,
    forgotPasswordController,
    resetPasswordController
} from './auth.controllers';

const router = express.Router();

router.post('/register', signupController)
router.post('/forgot-password', forgotPasswordController)
router.post('/password-reset', resetPasswordController)

export default router;