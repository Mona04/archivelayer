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
  rawContent: string,
}

export interface ProcessParams {
  docType: DocumentType,
  filePath: string,
  FileFullPath: string,
  remarkPlugins: unifiedd.PluggableList|undefined,
  rehypePlugins: unifiedd.PluggableList|undefined,
  callback: (data:ProcessedDocument) => void
}

async function processMarkdown(params:ProcessParams, data:Buffer)
{
  const parsedContent = matter(data);
  const metaData = parsedContent.data;
  const content = parsedContent.content;

  var parsed = unified().use(parse)

  if(params.remarkPlugins != undefined)
  {
    parsed = parsed.use(params.remarkPlugins)
  }

  var rehyped = parsed.use(rehype, {allowDangerousHtml: true });

  if(params.rehypePlugins != undefined)
  {
    rehyped = rehyped.use(params.rehypePlugins);
  }

  var htmled = rehyped.use(stringfy);

  htmled.process(content, (err, data)=>{
    if(err){
      console.log(err)
    }
    else{
      params.callback({
        documentType  : params.docType, 
        filePath      : params.filePath, 
        rawContent    : content,
        metaData      : metaData, 
        content       : data!.toString()
      });
    }
  });
}

async function processMDX(params:ProcessParams, data:Buffer)
{
  const parsedContent = matter(data);
  const metaData = parsedContent.data;
  const content = parsedContent.content;

  const compiled = await compile(content, { 
    outputFormat: 'function-body',
    development: false,
    remarkPlugins: params.remarkPlugins,
    rehypePlugins: params.rehypePlugins});

    params.callback({
      documentType : params.docType, 
      filePath     : params.filePath, 
      rawContent   : content,
      metaData     : metaData, 
      content      : compiled.value.toString(),
    });  
}

function waitFor(condition:()=>boolean, delay:number) {

  const poll = (resolve:any) => {
    if(condition()) resolve();
    else setTimeout(() => poll(resolve), delay);
  }

  return new Promise(poll);
}

export async function processDocument(params:ProcessParams)
{
  let finished = false;
  
  fs.readFile(params.FileFullPath, async (err, data)=>
  {
    try{   
      if(err){
        console.error(err)
      }
      else
      {
        if(params.docType.contentType === 'mdx')
        {
          await processMDX(params, data);
        }
        else
        {
          await processMarkdown(params, data);
        }
      }
    }
    catch(e){
      console.error(`====== Failed to processing document ${params.FileFullPath} ======`);
      console.error(e);
    }
    finally{
      finished = true;
    }
  });

  await waitFor(()=>finished==true, 300);
}