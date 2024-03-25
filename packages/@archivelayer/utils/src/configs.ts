export interface DocumentType {
  contentType?  : 'markdown' | 'mdx' | undefined,
  filePathPattern? : string,
}


export interface ArchiveLayerConfigs {
    sourcePath?   : string | undefined,
    documentTypes?: [DocumentType | {():DocumentType}] | undefined,
  }