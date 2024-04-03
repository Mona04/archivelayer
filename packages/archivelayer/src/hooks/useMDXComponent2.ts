import { runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { Fragment, createElement } from 'react';

export function useMDXComponent2(props: {code:string})
{
  const {default:Content} = runSync(
    props.code, 
    {
      ...runtime,
      baseUrl:import.meta.url,
      Fragment: Fragment
    });
  return createElement(Content, {});
}
