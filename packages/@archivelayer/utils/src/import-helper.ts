import path from 'path'
import { ArchiveLayerConfigs } from './configs';

export async function requireConfigs() : Promise<ArchiveLayerConfigs> {
  var configPath = path.join(process.cwd(), "archivelayer.config.js")
  const res = await import(/* webpackIgnore: true */`file://${configPath}`)
  .catch((r): { default: ArchiveLayerConfigs } =>{
    console.log("archivelayer.config.js is not exists or invalid.")
    console.log(r)
    return { default : {}};
  })
  return res.default;
}