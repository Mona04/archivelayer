import path from 'path'
import fs from 'fs'

function findFile(findpath:string, filename:string) 
{
  findpath = path.normalize(findpath).replace(/\//gi, '\\');

  for(let i = 0; i < 20; i++)
  {
    const cur = path.join(findpath, filename)
    if(fs.existsSync(cur))
    {
      return cur;
    }
    findpath = findpath.substring(0, findpath.lastIndexOf('\\'));
  }
}

export async function requireConfigs<T>(basePath?:string|null) : Promise<T> 
{
  if(basePath == null) basePath = process.cwd();

  var configPath = findFile(basePath, "archivelayer.config.js");

  const res = await import(/* webpackIgnore: true */`file://${configPath}`)
    .catch((r): { default: any } =>{
      console.log("archivelayer.config.js is not exists or invalid.")
      console.log(r)
      return { default : {}};
    })
  return res.default;
}