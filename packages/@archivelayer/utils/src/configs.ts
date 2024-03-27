import type * as unified from 'unified'

export interface DocumentType {
  contentType?  : 'markdown' | 'mdx' | undefined,
  filePathPattern? : string,
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
    sourcePath?   : string | undefined,
    documentTypes?: [DocumentType | {():DocumentType}] | undefined,
    markdown?: MarkdownOptions,
    mdx?: MDXOptions
  }