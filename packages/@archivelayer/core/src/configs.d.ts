import type * as unified from 'unified'

export type FieldType = 'string' | 'boolean' | 'date' | 'list';
export interface FieldDef {
  required: boolean,
  type: FieldType,
  of: undefined | { type: FieldType}
}
export interface FieldDefs {
  [fieldName:string]: FieldDef
}

export interface DocumentType {
  name: string,
  contentType?  : 'markdown' | 'mdx' | undefined,
  filePathPattern? : string,
  fields: FieldDefs
}

export type MarkdownOptions = {
  remarkPlugins?: unified.Pluggable[]
  rehypePlugins?: unified.Pluggable[]
}

export type MDXOptions = {
  remarkPlugins?: unified.Pluggable[]
  rehypePlugins?: unified.Pluggable[]
}

export interface ArchiveLayerConfigs {
    sourcePath    : string | undefined,
    documentTypes : (DocumentType | {():DocumentType})[] ,
    markdown?: MarkdownOptions,
    mdx?: MDXOptions
  }