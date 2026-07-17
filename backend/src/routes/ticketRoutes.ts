import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createTicket, getTickets, updateTicketStatus } from '../controllers/ticketController.js';

const router = express.Router();

// POST /api/tickets (Public)
router.post('/', createTicket);

// GET /api/tickets (Protected)
router.get('/', authenticateToken, getTickets);

// PATCH /api/tickets/:id/status (Protected)
router.patch('/:id/status', authenticateToken, updateTicketStatus);

export default router;
