import fs from 'fs'

export default class FileWatcher
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
  #watchCallback : fs.WatchListener<string> = (eventName, fileName) => {
    if(fileName === null) return;
    fileName = fileName.replace('\\', '/');

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