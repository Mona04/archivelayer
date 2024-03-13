//import module from 'module'
import path from 'path'

export async function requireFromString(filename : string) {
  var configPath = path.join(process.cwd(), filename)
  const res = await import(/* webpackIgnore: true */`file://${configPath}`);
  //const res = { default : { AAA : "ggodd"}}
  return res;
}