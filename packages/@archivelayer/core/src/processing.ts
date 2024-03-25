import fs from 'fs'
import { minimatch } from 'minimatch';
import {
  requireConfigs, WatchFile, ArchiveLayerConfigs, 
  DocumentType,
  getValue
} from '@archivelayer/utils'

function matchesPattern(filePath:string, pattern:string) {
  return minimatch(filePath, pattern)
}

const checkFilePath = (docType : DocumentType, filePath: string) => {
  ;//docType.
};

const callback = (configs:ArchiveLayerConfigs, fileName:string) => {
  
  const filePath = `${configs.sourcePath}/${fileName}`;

  const file = fs.readFileSync(filePath);

  
  if(configs.documentTypes != undefined)
  {

    for(var docType of configs.documentTypes){
      console.log(docType)
      const r = isThisDocumentType(getValue(docType), fileName)
      console.log(r);
    }
  
  }
  //console.log(file.toString())
}

const isThisDocumentType = (docType:DocumentType, fileName: string) : boolean => {
  if(docType.filePathPattern === undefined) return true;
  if(matchesPattern(fileName, docType.filePathPattern) == false) return false;
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