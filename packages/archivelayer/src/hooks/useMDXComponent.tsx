import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { Fragment, useState, useEffect } from 'react';
import { MDXModule } from '@mdx-js/mdx/lib/evaluate';

export const useMDXComponent = (props:{code:string}) => {
  const [mdxModule, setMdxModule] = useState<MDXModule>()
  const Content = mdxModule ? mdxModule.default : Fragment
  
  useEffect(function () {
    ;(async function () {
      var a = await run(props.code, 
      {
        ...runtime, 
        baseUrl: import.meta.url, 
        Fragment: Fragment
      });
      setMdxModule(a)
    })()
  }, [props.code])
    
  return <Content/>
}