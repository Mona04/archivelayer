import {findFile} from '@archivelayer/utils'
import {ArchiveLayerConfigs} from './configs'

/**
 * 런타임에 archivelayer.config.js 를 로딩하는 함수
 * 해당 파일은 ArchiveLayerConfigs 를 export 하는 EXModule 이어야 한다.
 * @param basePath 
 * @returns 
 */
export async function requireConfigs(basePath?:string|null) : Promise<ArchiveLayerConfigs> 
{
  if(basePath == null) basePath = process.cwd();

  var configPath = findFile(basePath, "archivelayer.config.js");

  const res = await import(/* webpackIgnore: true */`file://${configPath}`)
    .catch((r): { default: any } =>{
      console.log("archivelayer.config.js is not exists or invalid.")
      console.log(r)
      return { default : {}};
    });
  
  return res.default;
}