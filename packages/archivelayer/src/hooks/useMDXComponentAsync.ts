import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { createElement } from 'react';
import { MDXArgs, MDXProps } from './mdxComponent';

export async function useMDXComponentAsync(args:MDXArgs, props:MDXProps)
{
  const {default:Content} = await run(
    args.code, 
    {
      ...runtime,
      baseUrl: args.baseUrl == undefined ? import.meta.url : args.baseUrl
    });
  return createElement(Content, props);
}
