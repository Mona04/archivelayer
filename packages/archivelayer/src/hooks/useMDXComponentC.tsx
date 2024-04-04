import { run } from '@mdx-js/mdx'
import { MDXModule } from '@mdx-js/mdx/lib/evaluate';
import * as runtime from 'react/jsx-runtime'
import { Fragment, useState, useEffect, createElement } from 'react';
import { MDXArgs, MDXProps } from './mdxComponent';

export const useMDXComponentC = (args:MDXArgs, props:MDXProps) => 
{
  const [mdxModule, setMdxModule] = useState<MDXModule>()
  
  useEffect(function () {
    ;(async function () {
      var a = await run(args.code, 
      {
        ...runtime, 
        baseUrl: args.baseUrl == undefined ? import.meta.url : args.baseUrl,
        Fragment: Fragment,        
      });
      setMdxModule(a)
    })()
  }, [args.code])
    
  if(mdxModule) return createElement(mdxModule.default, props);
  else createElement(Fragment, props);
}