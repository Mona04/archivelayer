import {defineDocumentType} from "archivelayer"

import rm_gfm      from 'remark-gfm'
import rm_math     from 'remark-math'

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
  mdx:{ 
    remarkPlugins: [ 
      rm_gfm, [rm_math,]
    ],
    rehypePlugins: [
    ]
  },
}

export default config;