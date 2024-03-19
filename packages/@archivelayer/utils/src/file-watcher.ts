import fs from 'fs'

export function watchFile(path : string) 
{
  console.log("!!!")
  fs.watch(path, (curr, name) => {
    console.log(`${curr} : ${name}`)
  })
}