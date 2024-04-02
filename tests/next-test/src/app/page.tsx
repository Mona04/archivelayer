//import {allBlogMDPosts} from '@/archivelayer/generated/index.mjs'

import {allBlogMDPosts, allBlogMDXPosts} from './../../.archivelayer/generated'
import { useMDXComponent, mdxContent } from 'archivelayer'

export default  function PostView() {
  var posts = allBlogMDPosts.map(e => {
    return <div id={e._id} dangerouslySetInnerHTML={{__html:e.body.html}}/>;
  });
  var mdxposts = allBlogMDXPosts.map( e=>{
    
  });
  //var AAA =  mdxContent(allBlogMDXPosts[0].body.code)
  var BBB =  useMDXComponent(allBlogMDXPosts[0].body.code)

  return (
    <>
      <h1>Archive Layer Test</h1>
      {BBB}
    </>
  )
}