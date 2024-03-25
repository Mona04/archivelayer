import {defineDocumentType} from "archivelayer"

export const BlogMDPost = defineDocumentType(() => ({
  name: 'BlogMDPost',
  filePathPattern: `**/*.md`,
  contentType: 'markdown'
  //fields: blogFields(),  
  //computedFields: blogComputedFields(),
}))

/**
 * @type {import('archivelayer').ArchiveLayerConfigs}
 **/
const config  = {
  sourcePath: "./_content/",
  documentTypes: [BlogMDPost],
}

export default config;