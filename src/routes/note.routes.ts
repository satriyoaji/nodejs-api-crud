import express from 'express';
import {
    getByIdHandler,
    deleteHandler,
    createHandler,
    updateHandler,
    getPagedHandler,
    getNoteListHandler
} from '../controllers/note.controller';
import { validate } from '../middleware/validate';
import { noteSchema, pagedSchema } from '../schemas/note.schema';

const router = express.Router();

router.get('/', getNoteListHandler);
router.get('/paged/', validate(pagedSchema), getPagedHandler);
router.post('/', validate(noteSchema), createHandler);
router.get('/:note_id', getByIdHandler);
router.delete('/:note_id', deleteHandler);
router.put('/:note_id', validate(noteSchema), updateHandler);

export default router;
