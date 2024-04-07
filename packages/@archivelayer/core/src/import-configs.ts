import {findFile} from '@archivelayer/utils'
import {ArchiveLayerConfigs} from './configs'

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