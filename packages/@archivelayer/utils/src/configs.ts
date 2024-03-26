import type * as unified from 'unified'

export interface DocumentType {
  contentType?  : 'markdown' | 'mdx' | undefined,
  filePathPattern? : string,
}

export interface ArchiveLayerConfigs {
    sourcePath?   : string | undefined,
    documentTypes?: [DocumentType | {():DocumentType}] | undefined,
    mdx?: {
      remarkPlugins: unified.Pluggable[],
      rehypePlugins: unified.Pluggable[],
    },
  }