import {
  isFilePathMatchPattern,
  getValue
} from '@archivelayer/utils'

import {
  DocumentType
} from './configs'

import fs from 'fs'

import type * as unifiedd from 'unified'
import {unified} from 'unified'
import parse     from 'remark-parse'
import mdx       from 'remark-mdx'
import rehype    from 'remark-rehype'
import stringfy  from 'rehype-stringify'
import matter    from 'gray-matter'

import {compile, compileSync} from '@mdx-js/mdx'

export const isThisDocumentType = (docType:DocumentType, fileName: string) : boolean => {
  if(docType.filePathPattern === undefined) return true;
  if(isFilePathMatchPattern(fileName, docType.filePathPattern) == false) return false;
  return true;
}

export const getMatchingDocumentType = (documentTypes :(DocumentType | {():DocumentType})[], fileName:string) => 
{
  for(var docTypeInput of documentTypes)
  {
    const docType = getValue(docTypeInput);
    if(isThisDocumentType(docType, fileName) == false) continue;
    return docType;
  }
  return null;
}

export interface ProcessedDocument {
  documentType: DocumentType,
  filePath: string,
  metaData: { [key:string]: any},
  content: string,
}

export function processDocument(
  docType: DocumentType,
  filePath: string,
  FileFullPath: string,
  remarkPlugins: unifiedd.Pluggable[]|undefined,
  rehypePlugins: unifiedd.Pluggable[]|undefined,
  callback: (data:ProcessedDocument) => void
  )
{
  fs.readFile(FileFullPath, async (err, data)=>{
    if(err){
      console.log(err)
    }
    else{
      if(docType.contentType === 'mdx')
      {
        var k = await compile(data, {remarkPlugins:remarkPlugins, rehypePlugins: rehypePlugins});
        console.log(k);
        return;
      }

      var parsed = unified()
        .use(parse)

  

      if(remarkPlugins != undefined)
      {
        parsed = parsed.use(remarkPlugins)
      }

      var rehyped = parsed.use(rehype);

      if(rehypePlugins != undefined)
      {
        rehyped = rehyped.use(rehypePlugins);
      }
      
      var htmled = rehyped.use(stringfy);
      
      var parsedContent = matter(data);
      
      try{
        htmled.process(parsedContent.content, (err, data)=>{
          if(err){
            console.log(err)
          }
          else{
            callback({
              documentType: docType, 
              filePath: filePath, 
              metaData: parsedContent.data, 
              content: data!.toString()
            });
          }
        });
      }
      catch (err){
        console.log(err)
      }
    }
  });
}