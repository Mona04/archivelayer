import {defineDocumentType} from "archivelayer"

import rm_gfm      from 'remark-gfm'
import rm_math     from 'remark-math'
import prettyCode  from 'rehype-pretty-code'

export const BlogMDPost = defineDocumentType(() => ({
  name: 'BlogMDPost',
  filePathPattern: `**/*.md`,
  contentType: 'markdown',
  fields: blogFields(),  
  //computedFields: blogComputedFields(),
}))

export const BlogMDXPost = defineDocumentType(() => ({
  name: 'BlogMDXPost',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: blogFields(),
  //computedFields: blogComputedFields(),
}))

/**
 * @type {import('archivelayer').ArchiveLayerConfigs}
 **/
const config = {
  sourcePath: "./_content/",
  documentTypes: [BlogMDPost, BlogMDXPost],
  mdx:{ 
    remarkPlugins: [ 
      rm_gfm, [rm_math,]
    ],
    rehypePlugins: [
      [ prettyCode, prettyCodeOption ]
    ]
  },
  markdown:{ 
    remarkPlugins: [ 
      rm_gfm, [rm_math,]
    ],
    rehypePlugins: [
      [ prettyCode, prettyCodeOption ]
    ]
  }
}

function blogFields() {
  return {
    title:        { required: true,  type: 'string',  },
    date:         { required: false, type: 'date',     },
    description:  { required: false, type: 'string',   },
    tags:         { required: false, type: 'list', of: {type: 'string'} },
    thumbnail:    { required: false, type: 'string'},
    isDirectory:  { required: false, type: 'boolean'},
  }
}

/**
 * // https://rehype-pretty-code.netlify.app/    
 * @returns 
 */
function prettyCodeOption()
{
  return  {
    grid: true,
    showLineNumbers: true,
    keepBackground: true,
    //theme: {
    //  dark: 'github-dark',//'rose-pine-moon',
    //},
    theme: JSON.parse(
      readFileSync(new URL('../../../src/configs/pretty-code-theme.json', import.meta.url), 'utf-8')
    ),
    //onVisitTitle: onVisitTitle,
  };
}

export default config;