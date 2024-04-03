'use client'
import {allBlogMDPosts, allBlogMDXPosts} from './../../.archivelayer/generated'
import {useMDXComponent2} from 'archivelayer/hooks'


export default  function PostView() {
  var posts = allBlogMDPosts.map(e => {
    return <div id={e._id} dangerouslySetInnerHTML={{__html:e.body.html}}/>;
  });
  var mdxposts = allBlogMDXPosts.map( e=>{
    return <div key={e._id}>
      <p>{e.url}</p>
      {useMDXComponent2({code:e.body.code})}
    </div>
  });
  return (
    <>
      <h1>Archive Layer Test</h1>
      {mdxposts}
    </>
  )
}