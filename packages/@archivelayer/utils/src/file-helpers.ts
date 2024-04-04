import fs from 'fs'
import {minimatch} from 'minimatch'

export function isFilePathMatchPattern(filePath:string, pattern:string) {
  return minimatch(filePath, pattern)
}

export class FileWatcher
{
  mActionDone : {[key:string]:number} = {} 
  mBasePath = "";

  mUpdateCallback : (fileName:string) => void;
  mRemoveCallback : (fileName:string) => void;

  constructor(
    path:string, 
    updateCallback:(fileName:string) => void,
    removeCallback:(fileName:string) => void)
  {
    this.mBasePath = path;
    this.mUpdateCallback = updateCallback;
    this.mRemoveCallback = removeCallback;
    fs.watch(path, {recursive: true}, this.#watchCallback)
  }

  // https://stackoverflow.com/questions/67244227/watch-files-and-folders-recursively-with-node-js-also-get-info-whenever-change
  #watchCallback : fs.WatchListener<string> = (eventName, fileName) =>
  {
    if(fileName === null) return;
    fileName = fileName.replace(/\\/gi, '/');
  
    var path = `${this.mBasePath}/${fileName}`;

    if(fs.existsSync(path) == false){
      this.mRemoveCallback(fileName);
      return;
    }

    const stats = fs.statSync(path);
    const seconds = +stats.mtime;
    
    if(this.mActionDone[fileName] == seconds) return;

    this.mActionDone[fileName] = seconds
    this.mUpdateCallback(fileName);
  }
}

export const listFiles = async (  
  path:string, 
  updateCallback: (fileName:string)=>(void|Promise<void>),
  finishCallback: (deltaTimeMS: number)=>void
)=>
{
  const lastFrameTime = performance.now();

  const files = fs.readdirSync(
    path, 
    {
      encoding:'utf-8', 
      withFileTypes: false, 
      recursive: true
    }).filter(f=>fs.lstatSync(`${path}${f}`).isFile());

  const denominator = files.length;
  let numerator = 0;

  const promises = files.map(async f=>{
    f = f.replace(/\\/gi, '/');

    await updateCallback(f);
    numerator++;
    process.stdout.write("\r\x1b[K");
    process.stdout.write(`(${numerator}/${denominator}) finished ${f}`);//
  });
  await Promise.all(promises);
  process.stdout.write("\n");

  const currentTime = performance.now();

  finishCallback(currentTime - lastFrameTime);
};