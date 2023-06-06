import { object, string, TypeOf, z } from 'zod';

export enum SortingColumn {
  TITLE = 'title',
  DESCRIPTION = 'description',
}

export enum SearchingColumn {
  TITLE = 'title',
  DESCRIPTION = 'description',
}

export const noteSchema = object({
  body: object({
    title: string({
      required_error: 'Title is required',
    }).max(50, 'Title must be less than 50 characters').min(3, 'Title must be at least 3 characters'),

    description: z.optional(z.string()),
    image_url: z.optional(z.array(z.string())),
  })
});

export const pagedSchema = object({
  query: object({
    page: z.optional(z.string()),
    size: z.optional(z.string()),
    sorting_column: z.optional(z.nativeEnum(SortingColumn, {
      invalid_type_error: 'Sorting column is one of the following: title, description',
    })),
    sorting_order: z.optional(z.enum(['asc', 'desc'])),
    keyword: z.optional(z.string()),
    searching_column: z.optional(z.array(z.nativeEnum(SearchingColumn, {
      invalid_type_error: 'Searching column is one of the following: title, description',
    }))),
    category_id: z.optional(z.string()),
  })
});


export type noteInputSchema = TypeOf<typeof noteSchema>['body'];
export type pagedInputSchema = TypeOf<typeof pagedSchema>['query'];