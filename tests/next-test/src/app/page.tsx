//import {allBlogMDPosts} from '@/archivelayer/generated/index.mjs'
import {allBlogMDPosts, allBlogMDXPosts} from './../../.archivelayer/generated'
import { MDXProvider, useMDXComponents } from '@mdx-js/react'
import { } from '@mdx-js/mdx'

export default function PostView() {
  var posts = allBlogMDPosts.map(e => {
    return <div id={e._id} dangerouslySetInnerHTML={{__html:e.body.html}}/>;
  });
  var mdxposts = allBlogMDXPosts.map(async e=>{

  });
  return (
    <>
      <h1>Archive Layer Test</h1>
      {mdxposts}
    </>
  )
}