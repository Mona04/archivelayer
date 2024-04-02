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
import rehype    from 'remark-rehype'
import stringfy  from 'rehype-stringify'
import matter    from 'gray-matter'

import {compile} from '@mdx-js/mdx'

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
  fs.readFile(FileFullPath, async (err, data)=>
  {
    if(err){
      console.log(err)
    }
    else
    {
      const parsedContent = matter(data);
      const metaData = parsedContent.data;
      const content = parsedContent.content;

      if(docType.contentType === 'mdx')
      {
        const compiled = await compile(content, { 
          outputFormat: 'function-body',
          development: false,
          remarkPlugins: remarkPlugins,
          rehypePlugins: rehypePlugins});
        callback({
          documentType: docType, 
          filePath: filePath, 
          metaData: metaData, 
          content: compiled.value.toString()
        });
      }
      else
      {
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
      
        try{
          htmled.process(content, (err, data)=>{
            if(err){
              console.log(err)
            }
            else{
              callback({
                documentType: docType, 
                filePath: filePath, 
                metaData: metaData, 
                content: data!.toString()
              });
            }
          });
        }
        catch (err){
          console.log(err)
        }
      }
    }
  });
}