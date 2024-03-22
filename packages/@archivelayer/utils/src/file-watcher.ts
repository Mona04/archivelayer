import fs from 'fs'

export class WatchFile
{
  mActionDone : {[key:string]:number} = {} 
  mPath = "";
  mCallback : (fileName:string) => void;
  constructor(path:string, callback:(fileName:string) => void)
  {
    this.mPath = path;
    this.mCallback = callback;
    fs.watch(path, {recursive: true}, this.watchCallback)
  }
  watchCallback : fs.WatchListener<string> = (eventName, fileName) => {
    var path = `${this.mPath}/${fileName}`;
    var stats = fs.statSync(path);
    let seconds = +stats.mtime;
    
    if(fileName === null) return;
    if(this.mActionDone[fileName] == seconds) return;
    this.mActionDone[fileName] = seconds

    this.mCallback(fileName);
  }
}