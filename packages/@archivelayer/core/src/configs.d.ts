import type * as unified from 'unified'


export interface RawDocumentData{
  sourceFilePath: string,
  sourceFileDir:  string,
  sourceFileName: string,
  flattenedPath:  string
}

export interface MDXContent{
  code: string
}
export interface MarkdownContent{
  html: string
}

export type DocumentData = any & {_raw:RawDocumentData, body:MDXContent|MarkdownContent}


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