import fs from 'fs'

import { getValue } from '@archivelayer/utils'
import { ProcessedDocument, getMatchingDocumentType, processDocument } from './document-utils.js'
import { ArchiveLayerConfigs, DocumentData, DocumentType } from './configs'
import FileListCache from './archive-cache.js'

const BASE_PATH = './.archivelayer/';
const BASE_GEN_PATH = './.archivelayer/generated/';

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
    this.#updateAll();
  }

  fileUpdated(fileName:string)
  {    
    const docType = getMatchingDocumentType(this.mConfigs.documentTypes, fileName);
    if(docType == null) return;

    const fileFullPath = `${this.mConfigs.sourcePath}/${fileName}`;

    if(docType.contentType === 'mdx')
    {
      processDocument(
        {
          docType:docType,
          filePath: fileName,
          FileFullPath: fileFullPath,
          remarkPlugins: this.mConfigs.mdx?.remarkPlugins,
          rehypePlugins: this.mConfigs.mdx?.rehypePlugins,
          callback: d=>this.#updateFileCache(d),
        });
    }
    else if(docType.contentType === 'markdown')
    {
      processDocument(
        {
          docType:docType,
          filePath: fileName,
          FileFullPath: fileFullPath,
          remarkPlugins: this.mConfigs.markdown?.remarkPlugins,
          rehypePlugins: this.mConfigs.markdown?.rehypePlugins,
          callback: d=>this.#updateFileCache(d),
        });
    }
  }

  fileRemoved(fileName:string)
  {
    const docType = getMatchingDocumentType(this.mConfigs.documentTypes, fileName);
    if(docType == null) return;
  
    this.mFileListCache.remove(docType, fileName);
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

    fs.writeFileSync(`${BASE_GEN_PATH}index.mjs`, fileMJS);
    fs.writeFileSync(`${BASE_GEN_PATH}index.d.ts`, fileDTS);
  }

  #makeTypeExportFile()
  {
    var typedts = `
import type { MarkdownBody, MDXBody, RawDocumentData } from '@archivelayer/core'

export type { MarkdownBody, MDXBody, RawDocumentData }\n`;
    for(const docTypeInput of this.mConfigs.documentTypes)
    {
      const docType = getValue(docTypeInput);    
      var docExport = '/** Document types */';
      docExport += `\nexport type ${docType.name} = {\n`;

      docExport += `  _id:  string,\n`
      docExport += `  _type: ${docType.name},\n`
      docExport += `  _raw: RawDocumentData,\n`
      docExport += `  body: ${(docType.contentType === 'markdown' ? 'MarkdownBody' : 'MDXBody')},\n`

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

      for(const fieldName in docType.computedFields)
      {
        const field = docType.computedFields[fieldName];
        
        switch(field?.type)
        {
          case 'list':
            docExport += `  ${fieldName}: any[],\n`            
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

    this.#writeFile(`${BASE_GEN_PATH}types.d.ts`, typedts);
  }
  
  /**
   * Update a file.
   */
  #updateFileCache(data: ProcessedDocument)
  {
    const doc : DocumentData = {
      _id: data.filePath,
      _raw: {
        sourceFilePath:  data.filePath,
        sourceFileDir:   data.filePath.substring(0, data.filePath.lastIndexOf('/')+1),
        sourceFileName:  data.filePath.replace(/^.*[\\/]/, ''),
        flattenedPath:   data.filePath.replace(/\.[^/.]+$/, ""),
        source:          data.rawContent
      }
    };

    switch (data.documentType.contentType)
    {
      case 'markdown':
        doc.body = {html: data.content};
        break;
      case 'mdx':
        doc.body = {code: data.content};
        break;
    }

    for(const fieldName in data.documentType.fields)
    {
      const field = data.documentType.fields[fieldName];
      const fieldData = data.metaData[fieldName]
      
      if(fieldData === undefined)
      {
        if(field?.required)
        {
          console.warn(`${fieldName} is not exist in ${data.filePath}`);
        }
      }
      else
      {
        doc[fieldName] = fieldData;
      }
    }

    for(const fieldName in data.documentType.computedFields)
    {
      const field = data.documentType.computedFields[fieldName];
      
      doc[fieldName] = field?.resolve(doc);
    }

    const jsonFileName = `${doc._raw.flattenedPath.replace(/\//gi, '_')}`;
    const targetPath = `${BASE_GEN_PATH}${data.documentType.name}/${jsonFileName}.json`;

    this.#writeFile(targetPath, JSON.stringify(doc, null, 2));
    this.mFileListCache.add(data.documentType, data.filePath, jsonFileName);
    this.#updateDocumentIndex(data.documentType);
  }

  /**
   * Update [DocumentType]/index.js.
   */
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
        file += `import ${cache?.jsonPath} from './${cache?.jsonPath}.json' assert { type: 'json' } \n`
        lastLine += `${cache?.jsonPath}, `     
      }
  
      if(Object.keys(fileList).length > 0)
      {
        file += `\n${lastLine}]`;
      }
    }

    this.#writeFile(`${BASE_GEN_PATH}/${docType.name}/_index.mjs`, file);
  }

  /**
   * update all files in the base directory.
   */
  #updateAll()
  {
    const files = fs.readdirSync(
      this.mConfigs.sourcePath!, 
      {
        encoding:'utf-8', 
        withFileTypes: false, 
        recursive: true
      });
 
    files.filter(f=>fs.lstatSync(`${this.mConfigs.sourcePath!}${f}`).isFile()).forEach(f=>{
      f = f.replace(/\\/gi, '/');
      this.fileUpdated(f);
    });
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