import { DeepPartial, FindOperator, ILike } from 'typeorm';
import { Note } from '../entities/note.entity';
import { AppDataSource } from '../utils/data-source';
import { SortingColumn, SearchingColumn } from '../schemas/note.schema';

const noteRepository = AppDataSource.getRepository(Note);

export const findNotes = async () => {
    return await noteRepository.createQueryBuilder("notes").getMany();
}

export const getById = async (noteId: string) => {
    return noteRepository.findOneBy({ id: noteId });
}

export const deleteById = async (noteId: string) => {
    return noteRepository.delete({
        id: noteId
    })
}

export const create = async (note: DeepPartial<Note>) => {
    return noteRepository.insert(noteRepository.create(note));
}

export const update = async (note: DeepPartial<Note>) => {
    return noteRepository.update({id: note.id}, noteRepository.create(note));
}

export const getPaged = async (
    page: number,
    sorting_column: SortingColumn,
    sorting_order: 'asc' | 'desc',
    keyword: string,
    searching_column: SearchingColumn[],
    pageSize: number = 10
    ) => {
    let normalized_sorting_column: string = `notes.${sorting_column}`;
    const normalized_sorting_order = sorting_order === 'asc' ? 'ASC' : 'DESC';
    const search_clause: string[] = [];

    for (const column of searching_column) {
        let normalized_searching_column: string = `notes.${column}`;
        search_clause.push(`${normalized_searching_column} ILIKE :keyword`);
    }

    const notes = noteRepository
        .createQueryBuilder('notes')
        // .innerJoinAndSelect( 'notes.category_id', categories_alias, `${categories_alias}.id = notes.category_id`)
        .orderBy(`${normalized_sorting_column}`, normalized_sorting_order)
        .where(search_clause.join(" OR "), { keyword: `%${keyword}%` })

    const totalItems = await notes.getCount();
    const totalPage = Math.ceil(totalItems / pageSize);
    const paginatedNotes = await notes.skip((page - 1) * pageSize).take(pageSize).getMany();

    return {
        data: paginatedNotes,
        totalItems,
        pagination: {
            current_page: page,
            total_page: totalPage,
        }
    }
}
