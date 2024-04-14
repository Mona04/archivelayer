import {allBlogMDXPosts} from './../../../.archivelayer/generated'
import {useMDXComponentAsync} from 'archivelayer/hooks'

export default  function PostView() {
  var mdxposts = allBlogMDXPosts.map(async e=>{
    return <div key={e._id}>
      <p>{e.url}</p>
      {await useMDXComponentAsync({code:e.body.code, baseUrl: import.meta.url}, { "year": 123 })}
    </div>
  });

  return (
    <>
      <h1>Archive Layer Test</h1>
      {mdxposts}
    </>
  )
}