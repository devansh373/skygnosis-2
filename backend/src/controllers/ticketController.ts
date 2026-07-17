import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db.js';
import { triageTicketMessage } from '../services/gemini.js';
import { AuthRequest } from '../middleware/auth.js';

// Schemas
const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

const statusSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Resolved']),
});

export const createTicket = async (req: Request, res: Response) => {
  try {
    const parsedData = ticketSchema.parse(req.body);

    // Call Gemini with timeout
    const aiResult = await triageTicketMessage(parsedData.message);

    // Save to Postgres
    const ticket = await prisma.ticket.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        message: parsedData.message,
        priority: aiResult.priority,
        category: aiResult.category,
        suggested_reply: aiResult.suggested_reply,
        ai_success: aiResult.ai_success,
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, category, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (category) {
      where.category = category;
    }
    
    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy as string]: sortOrder,
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    res.json({ total, page: Number(page), items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parsedData = statusSchema.parse(req.body);

    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { status: parsedData.status },
    });

    res.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid status', details: (error as any).errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
