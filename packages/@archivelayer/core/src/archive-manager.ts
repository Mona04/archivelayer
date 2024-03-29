import fs from 'fs'

import { getValue } from '@archivelayer/utils'
import FileListCache from './archive-cache.js'
import {ArchiveLayerConfigs, DocumentData, DocumentType } from './configs'

const BASE_PATH = './.archivelayer/';
const BASE_GEN_PATH = './.archivelayer/.generated/';

class ArchiveManager
{
  mConfigs: ArchiveLayerConfigs;
  mFileListCache: FileListCache;

  constructor()
  {
    this.mConfigs = {sourcePath:"", documentTypes:[]};
    this.mFileListCache = new FileListCache();
  }

  initialize(configs: ArchiveLayerConfigs)
  {
    this.mConfigs = configs;

    this.#checkBaseDirectory();    
    this.#makePackageJson();
    this.#makeIndex();
    this.#makeTypeExportFile(); 
  }

  updateFile(
    docType : DocumentType,
    filePath: string, 
    metaData: {[key:string]:any}, 
    content: string)
  {
    this.#updateFileCache(docType, filePath, metaData, content);
  }

  removeFile(docType: DocumentType, filePath: string)
  {
    this.mFileListCache.remove(docType, filePath);
    this.#updateDocumentIndex(docType);
  }

  #checkBaseDirectory()
  {
    if(fs.existsSync(BASE_PATH) == false)
    {
      fs.mkdirSync(BASE_PATH);
    }
    if(fs.existsSync(BASE_GEN_PATH) == false)
    {
      fs.mkdirSync(BASE_GEN_PATH);
    }

    // document type folder intialize
    for(var docTypeInput of this.mConfigs.documentTypes)
    {    
      const docType = getValue(docTypeInput);
      if(fs.existsSync(`${BASE_GEN_PATH}${docType.name}`) == false)
      {
        fs.mkdirSync(`${BASE_GEN_PATH}${docType.name}`);
      }
    }    
  }

  #makePackageJson()
  {
    const packagejson = `{
  "name": "dot-archivelayer",
  "description": "This package is auto-generated by Archivelayer",
  "version": "0.0.0-V6D4HYCP",
  "exports": {
  "./generated": {
    "import": "./generated/index.mjs"
    }
  },
  "typesVersions": {
    "*": { "generated": ["./generated"] }
  }
}`

    if(fs.existsSync(`${BASE_PATH}package.json`) == false)
    {
      fs.writeFileSync(`${BASE_PATH}package.json`, packagejson);
    }
  }

  #makeIndex()
  {
    // HMR 는 import 가 더 좋은데, 빌드 시에는 json 을 그냥 import 하는게 더 좋다고 함.
    // 일단 전자만 구현함.
    var fileMJS = "";
    var fileDTS = "import T from './types' \nexport * from './types' \n";
    const allFiless = [];

    for(const docTypeInput of this.mConfigs.documentTypes)
    {
      const docType = getValue(docTypeInput);
      const filesName = `all${docType.name}s`;

      allFiless.push(filesName);

      fileMJS += `import { all${docType.name}s } from './${docType.name}/_index.mjs' \n`
      fileDTS += `export declare const ${filesName}: T.${docType.name}[] \n`      
    }

    fileMJS += `export {${allFiless}}\n`

    fs.writeFileSync(`${BASE_PATH}index.mjs`, fileMJS);
    fs.writeFileSync(`${BASE_PATH}index.d.ts`, fileDTS);
  }

  #makeTypeExportFile()
  {
    var typedts = `
import type { MarkdownContent, MDXContent, RawDocumentData } from '@archivelayer/core'

export type { MarkdownContent, MDXContent, RawDocumentData }\n`;
    for(const docTypeInput of this.mConfigs.documentTypes)
    {
      const docType = getValue(docTypeInput);    
      var docExport = '/** Document types */';
      docExport += `\nexport type ${docType.name} = {\n`;

      docExport += `  _id:  string,\n`
      docExport += `  _type: ${docType.name},\n`
      docExport += `  _raw: RawDocumentData,\n`
      docExport += `  body: ${(docType.contentType === 'markdown' ? 'MarkdownContent' : 'MDXContent')},\n`

      for(const fieldName in docType.fields)
      {
        const field = docType.fields[fieldName];
        switch(field?.type)
        {
          case 'list':
            docExport += `  ${fieldName}: ${field.of?.type}[],\n`            
            break;
          case 'date':
            docExport += `  ${fieldName}: Date,\n`            
            break;
          default:
            docExport += `  ${fieldName}: ${field?.type},\n`;            
            break;
        }
      }

      docExport += '}\n'

      typedts += docExport;
    }

    this.#writeFile(`${BASE_PATH}types.d.ts`, typedts);
  }
  
  #updateFileCache(documentType: DocumentType, filePath: string, metaData: {[key:string]:any}, content: string)
  {
    const doc : DocumentData = {
      _id: filePath,
      _raw: {
        sourceFilePath: filePath,
        sourceFileDir: filePath.substring(0, filePath.lastIndexOf('/')+1),
        sourceFileName:  filePath.replace(/^.*[\\/]/, ''),
        flattenedPath:  filePath.replace(/\.[^/.]+$/, "")
      }
    };

    switch (documentType.contentType)
    {
      case 'markdown':
        doc.body = {html: content};
        break;
      case 'mdx':
        doc.body = {code: content};
        break;
    }

    for(const fieldName in documentType.fields)
    {
      const field = documentType.fields[fieldName];
      const fieldData = metaData[fieldName]
      
      if(fieldData === undefined)
      {
        if(field?.required)
        {
          console.warn(`${fieldName} is not exist in ${filePath}`);
        }
      }
      else
      {
        doc[fieldName] = fieldData;
      }
    }

    const targetPath = `${BASE_GEN_PATH}${documentType.name}/${doc._raw.flattenedPath.replace('/', '_')}.json`;
    
    this.#writeFile(targetPath, JSON.stringify(doc, null, 2));
    this.mFileListCache.add(documentType, filePath, doc._raw.flattenedPath.replace('/', '_'));
    this.#updateDocumentIndex(documentType);
  }

  #updateDocumentIndex(docType: DocumentType)
  {
    var file = "";
    var lastLine = `export const all${docType.name}s = [`;

    const fileList = this.mFileListCache.get(docType);
    if(fileList != undefined)
    {
      for(const key in fileList)
      {
        const cache = fileList[key];
        file += `import ${cache?.jsonPath} from '${cache?.jsonPath}.json' assert { type: 'json' }`
        lastLine += `${cache?.jsonPath}, `     
      }
  
      if(Object.keys(fileList).length > 0)
      {
        file += `\n${lastLine}]`;
      }
    }

    this.#writeFile(`${BASE_GEN_PATH}/${docType.name}/_index.mjs`, file);
  }

  #writeFile(path: string, obj: any){
    fs.writeFile(path, obj, 
      (e)=>{
        if(e != null){
          console.log(`Writing ${path} is failed. ${e}`);
        }
      }
    );
  }
}

export default ArchiveManager;