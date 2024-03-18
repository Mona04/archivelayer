import path from 'path'

export async function requireFromString(filename : string) {
  var configPath = path.join(process.cwd(), filename)
  const res = await import(/* webpackIgnore: true */`file://${configPath}.js`)
  .catch(()=>{
    return {};
  })
  return res;
}