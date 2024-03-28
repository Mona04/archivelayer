import path from 'path'

export async function requireConfigs<T>() : Promise<T> {
  var configPath = path.join(process.cwd(), "archivelayer.config.js")
  const res = await import(/* webpackIgnore: true */`file://${configPath}`)
  .catch((r): { default: any } =>{
    console.log("archivelayer.config.js is not exists or invalid.")
    console.log(r)
    return { default : {}};
  })
  return res.default;
}