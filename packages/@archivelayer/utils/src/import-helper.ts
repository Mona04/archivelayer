import path from 'path'
import { ArchiveLayerConfigs } from './configs';

export async function requireConfig() : Promise<ArchiveLayerConfigs> {
  var configPath = path.join(process.cwd(), "archivelayer.config.js")
  const res = await import(/* webpackIgnore: true */`file://${configPath}`)
  .catch(()=>{
    return { default : {}};
  })
  return res.default;
}