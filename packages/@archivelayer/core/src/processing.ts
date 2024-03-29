import fs from 'fs'

import type * as unifiedd from 'unified'
import {unified} from 'unified'
import parse     from 'remark-parse'
import mdx       from 'remark-mdx'
import rehype    from 'remark-rehype'
import stringfy  from 'rehype-stringify'
import matter    from 'gray-matter'

import {
  requireConfigs, WatchFile, isFilePathMatchPattern,
  getValue
} from '@archivelayer/utils'

import {
  ArchiveLayerConfigs, DocumentType
} from './configs'

import ArchiveManager from './archive-manager.js'

const archiveManager = new ArchiveManager();

const isThisDocumentType = (docType:DocumentType, fileName: string) : boolean => {
  if(docType.filePathPattern === undefined) return true;
  if(isFilePathMatchPattern(fileName, docType.filePathPattern) == false) return false;
  return true;
}

const getMatchingDocumentType = (configs:ArchiveLayerConfigs, fileName:string) => 
{
  for(var docTypeInput of configs.documentTypes)
  {
    const docType = getValue(docTypeInput);
    if(isThisDocumentType(docType, fileName) == false) continue;
    return docType;
  }
  return null;
}

function processContent(
  docType: DocumentType,
  filePath: string,
  FileFullPath: string,
  remarkPlugins: unifiedd.Pluggable[]|undefined,
  rehypePlugins: unifiedd.Pluggable[]|undefined
  )
{
  fs.readFile(FileFullPath, (err, data)=>{
    if(err){
      console.log(err)
    }
    else{
      var parsed = unified()
        .use(parse)

      if(docType.contentType === 'mdx')
      {
        parsed = parsed.use([mdx]);
      }

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
            archiveManager.updateFile(docType, filePath, parsedContent.data, data!.toString());
          }
        });
      }
      catch (err){
        console.log(err)
      }
    }
  });
}

const onFileUpdated = (configs:ArchiveLayerConfigs, fileName:string) =>
{    
  const docType = getMatchingDocumentType(configs, fileName);
  if(docType == null) return;
  
  const fileFullPath = `${configs.sourcePath}/${fileName}`;

  if(docType.contentType === 'mdx')
  {
    processContent(
      docType, fileName, fileFullPath, 
      configs.mdx?.remarkPlugins, 
      configs.mdx?.rehypePlugins);
  }
  else if(docType.contentType === 'markdown')
  {
    processContent(
      docType, fileName, fileFullPath, 
      configs.markdown?.remarkPlugins, 
      configs.markdown?.rehypePlugins);
  }
}

const onFileRemoved = (configs:ArchiveLayerConfigs, fileName:string) =>
{
  const docType = getMatchingDocumentType(configs, fileName);
  if(docType == null) return;

  archiveManager.removeFile(docType, fileName);
}

export async function Startup() 
{
  const configs = await requireConfigs<ArchiveLayerConfigs>();
  
  if(configs.sourcePath === undefined) return;

  archiveManager.initialize(configs);
  
  const watcher = new WatchFile(
    configs.sourcePath, 
    (fileName)=>{onFileUpdated(configs, fileName)},
    (fileName)=>{onFileRemoved(configs, fileName)}
  ); 

}