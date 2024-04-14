import {allBlogMDPosts} from './../../../.archivelayer/generated'

export default  function PostView() {
  var posts = allBlogMDPosts.map(e => {
    return <div key={e._id} dangerouslySetInnerHTML={{__html:e.body.html}}/>;
  });

  return (
    <>
      <h1>Archive Layer Test</h1>
      {posts}
    </>
  )
}