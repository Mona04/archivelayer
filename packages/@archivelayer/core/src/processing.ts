import fs from 'fs'
import { unified } from 'unified';
import parse from 'remark-parse'
import rehype from 'remark-rehype'
import stringfy from 'rehype-stringify'
import {
  requireConfigs, WatchFile, isFilePathMatchPattern,
  ArchiveLayerConfigs, DocumentType,
  getValue
} from '@archivelayer/utils'
function saveRawCode() {
  return  async (tree : any, ...prop: any)  => {

  }
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
      fs.readFile(filePath, (err, data)=>{
        if(err){
          console.log(err)
        }
        else{
          var parsed = unified().use(parse);
          
          var rehyped = parsed.use(rehype);
          rehyped = rehyped.use(saveRawCode);
          
          rehyped.use(stringfy).process(data, (err, data)=>{
            if(err){
              console.log(err)
            }
            else{
              console.log(data);
            }
          });
        }
      });
    }
  
  }
  //console.log(file.toString())
}

const isThisDocumentType = (docType:DocumentType, fileName: string) : boolean => {
  if(docType.filePathPattern === undefined) return true;
  if(isFilePathMatchPattern(fileName, docType.filePathPattern) == false) return false;
  return true;
}

export async function Startup() {
  const configs = await requireConfigs();
  
  if(configs.sourcePath === undefined) return;

  const watcher = new WatchFile(
    configs.sourcePath, 
    (fileName)=>{callback(configs, fileName)}
  ); 

}