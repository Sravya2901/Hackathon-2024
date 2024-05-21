// const express = require('express');
import express from 'express';
const router = express.Router();
// const { sendMessage } = require('../controllers/messageController');
import sendMessage from '../controllers/messageController.js';

// POST /send
router.post('/send', sendMessage);
// router.post('/sendCall', sendCall);
export default router;
