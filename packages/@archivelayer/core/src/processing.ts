import fs from 'fs'

import type * as unifiedd from 'unified'
import {unified} from 'unified'
import parse from 'remark-parse'
import rehype from 'remark-rehype'
import stringfy from 'rehype-stringify'
import matter from 'gray-matter'

import {
  requireConfigs, WatchFile, isFilePathMatchPattern,
  ArchiveLayerConfigs, DocumentType,
  getValue
} from '@archivelayer/utils'


const isThisDocumentType = (docType:DocumentType, fileName: string) : boolean => {
  if(docType.filePathPattern === undefined) return true;
  if(isFilePathMatchPattern(fileName, docType.filePathPattern) == false) return false;
  return true;
}

function processContent(
  filePath: string, 
  remarkPlugins: unifiedd.Pluggable[]|undefined,
  rehypePlugins: unifiedd.Pluggable[]|undefined)
{
  fs.readFile(filePath, (err, data)=>{
    if(err){
      console.log(err)
    }
    else{
      var parsed = unified().use(parse);

      //var parsed = parsed.use(gfm);

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
      
      htmled.process(parsedContent.content, (err, data)=>{
        if(err){
          console.log(err)
        }
        else{
          console.log(parsedContent.data)
          console.log(data);
        }
      });
    }
  });
}

const callback = (configs:ArchiveLayerConfigs, fileName:string) => {
    
  if(configs.documentTypes != undefined)
  {
    for(var docTypeInput of configs.documentTypes)
    {
      const docType = getValue(docTypeInput);
      const r = isThisDocumentType(docType, fileName)

      if(r == false) continue;
      
      const filePath = `${configs.sourcePath}/${fileName}`;

      if(docType.contentType === 'mdx')
      {
        processContent(filePath, configs.mdx?.remarkPlugins, configs.mdx?.rehypePlugins);
      }
      else if(docType.contentType === 'markdown')
      {
        processContent(filePath, configs.markdown?.remarkPlugins, configs.markdown?.rehypePlugins);
      }
    }  
  }
}

export async function Startup() {
  const configs = await requireConfigs();
  
  if(configs.sourcePath === undefined) return;

  const watcher = new WatchFile(
    configs.sourcePath, 
    (fileName)=>{callback(configs, fileName)}
  ); 

}