'use client'
import { runSync, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { Fragment, useState, useEffect } from 'react';
import { MDXModule } from '@mdx-js/mdx/lib/evaluate';

export function useMDXComponent(code:string) {
  const [mdxModule, setMdxModule] = useState<MDXModule>()
  const Content = mdxModule ? mdxModule.default : Fragment
  
  useEffect(function () {
    ;(async function () {
      var a = await run(code, 
        {
          ...runtime, 
          baseUrl: import.meta.url, 
          Fragment: runtime
        });
        setMdxModule(a)
      })()
    }, [code])
    
    return <Content />
  }

  
export function mdxContent(code:string)
{
  const {default: Content} = runSync(
    code, 
    {
      ...runtime,
      baseUrl:import.meta.url,
      Fragment: runtime
    });
  return Content;
}
