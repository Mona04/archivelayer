import { runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { Fragment, createElement } from 'react';
import { MDXArgs, MDXProps } from './mdxComponent';

export function useMDXComponent(args:MDXArgs, props:MDXProps)
{
  const {default:Content} = runSync(
    args.code, 
    {
      ...runtime,
      baseUrl: args.baseUrl == undefined ? import.meta.url : args.baseUrl,
      Fragment: Fragment
    });
  return createElement(Content, props);
}