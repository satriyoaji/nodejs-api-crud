import { object, string, TypeOf, z } from 'zod';

export enum SortingColumn {
  CONTENT = 'content',
}

export enum SearchingColumn {
  CONTENT = 'content',
}

export const noteSchema = object({
  body: object({
    content: string({
      required_error: 'Content is required',
    }).max(100, 'Content must be less than 100 characters').min(3, 'Content must be at least 3 characters'),

    image_url: z.optional(z.array(z.string())),
  })
});

export const pagedSchema = object({
  query: object({
    page: z.optional(z.string()),
    size: z.optional(z.string()),
    sorting_column: z.optional(z.nativeEnum(SortingColumn, {
      invalid_type_error: 'Sorting column is one of the following: content',
    })),
    sorting_order: z.optional(z.enum(['asc', 'desc'])),
    keyword: z.optional(z.string()),
    searching_column: z.optional(z.array(z.nativeEnum(SearchingColumn, {
      invalid_type_error: 'Searching column is one of the following: content',
    }))),
    category_id: z.optional(z.string()),
  })
});


export type noteInputSchema = TypeOf<typeof noteSchema>['body'];
export type pagedInputSchema = TypeOf<typeof pagedSchema>['query'];