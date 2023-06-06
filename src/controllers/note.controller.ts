import {NextFunction, Request, Response } from 'express';
import {getById, create, deleteById, update, getPaged, findNotes} from '../services/note.service';
import { noteInputSchema, pagedInputSchema, SortingColumn } from '../schemas/note.schema';
import AppError from '../utils/appError';
import { validate } from 'uuid';

export const getNoteListHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const note = await findNotes();

    if (note.length === 0) {
        return next(new AppError(404, 'No notes found'));
    }

    try {
        res.status(200).status(200).json({
            status: 'success',
            data: {
                note
            },
        });
    } catch (err: any) {
        next(err);
    }
};

export const getByIdHandler = async (
    req: Request<{
        note_id: string;
    }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const note_id = req.params.note_id;

        if(!validate(note_id)) {
            return next(new AppError(400, `Note id ${note_id} is not valid`));
        }
    
        const note_detail = await getById(note_id);

        if (!note_detail) {
            return next(new AppError(404, `Note with id ${note_id} not found`));
        }
    
        res.status(200).json({
            status: 'success',
            data: {
            note_detail,
            },
        });
    } catch (err: any) {
        next(err);
    }
};

export const getPagedHandler = async (
    req: Request<{}, {}, {}, pagedInputSchema>,
    res: Response,
    next: NextFunction
    ) => {
        try {
            const page = req.query.page || "1";
            const size = req.query.size || "10";
            const sorting_column = req.query.sorting_column || SortingColumn.CONTENT;
            const sorting_order = req.query.sorting_order || 'asc';
            const keyword = req.query.keyword || '';
            const searching_column = req.query.searching_column || [];

            if(keyword.length > 0 && searching_column.length == 0){
                return next(new AppError(400, `Searching column shouldn't is empty`));
            }

            if(keyword.length == 0 && searching_column.length > 0){
                return next(new AppError(400, `Keyword shouldn't is empty`));
            }
            
            const notes = await getPaged(
                parseInt(page),
                sorting_column,
                sorting_order,
                keyword,
                searching_column,
                parseInt(size)
            );

            res.status(200).json({
                status: 'success',
                data: {
                    notes: notes.data,
                },
                total_items: notes.totalItems,
                pagination: notes.pagination
            });
        } catch (err: any) {
            next(err);
        }
    };
            

export const deleteHandler = async (
    req: Request<{
        note_id: string;
    }>,
    res: Response,
    next: NextFunction
    ) => {
        try {
            const note_id = req.params.note_id;
            
            if(!validate(note_id)) {
                return next(new AppError(400, `Note id ${note_id} is not valid`));
            }

            const deleted_note = await deleteById(note_id);
            if (!deleted_note.affected) {
                return next(new AppError(404, `Note with id ${note_id} not found`));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    deleted_note,
                },
            });
        } catch (err: any) {
            next(err);
        }
    };

export const createHandler = async (
    req: Request<{}, {}, noteInputSchema>,
    res: Response,
    next: NextFunction
    ) => {
        try {
            const {
                content,
                image_url,
            } = req.body;
            // const modified_by: string = res.locals.user.id
            const created_note = await create({
                content,
                image_url,
            });
            res.status(201).json({
                status: 'success',
                data: {
                    created_note,
                },
            });
        } catch (err: any) {
            next(err);
        }
    };


export const updateHandler = async (
    req: Request<{
        note_id: string;
    }, {}, noteInputSchema, {}>,
    res: Response,
    next: NextFunction
    ) => {
        try {
            const {
                content,
                image_url,
            } = req.body;
            // const modified_by: string = res.locals.user.id
            const id = req.params.note_id;
            const updated_at = new Date();
            const updated_note = await update({
                id,
                content,
                image_url,
                updated_at
            });
            if (!updated_note.affected) {
                return next(new AppError(404, `Note with id ${id} not found`));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    updated_note,
                },
            });
        } catch (err: any) {
            next(err);
        }
    };
