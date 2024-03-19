import fs from 'fs'

export function watchFile(path : string) 
{
  fs.watchFile(path, (curr, prev) => {
    console.log('file changed')
  })
}