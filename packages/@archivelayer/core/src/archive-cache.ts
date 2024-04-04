import { DocumentType } from './configs'

/**
 * documentType 마다 현재 파일 리스트를 관리함. 
 * 그래서 export 등의 파일 작성에 사용.
 */
class FileListCache
{
  mFileDict: { [documentType:string]: {[key:string]: {jsonPath:string}}, };
  constructor()
  {
    this.mFileDict = {};
  }

  add(docType: DocumentType, key: string, jsonPath: string)
  {
    const files = this.mFileDict[docType.name];
    
    if(files == null) {
      this.mFileDict[docType.name] = {};
      this.add(docType, key, jsonPath);
      return;
    }

    files[key] = { jsonPath : jsonPath};
  }

  remove(docType: DocumentType, key: string)
  {
    const files = this.mFileDict[docType.name];
    
    if(files == null) {
      return;
    }

    delete files[key];
  }

  get(docType: DocumentType)
  {
    const files = this.mFileDict[docType.name];
    return files;
  }
}

export default FileListCache;