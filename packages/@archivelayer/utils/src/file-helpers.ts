import fs from 'fs'
import path from 'path'
import { minimatch} from 'minimatch'

export function isFilePathMatchPattern(filePath:string, pattern:string) {
  return minimatch(filePath, pattern)
}

/**
 * `fs.watch` 를 래핑하는 함수
 * 1. `fs.watch` 가 1번 수정되어도 2번 이상 신호를 주는 현상이 있어서 이를 막기위함
 * 2. 파일의 경로 끝에 지정한 경로를 붙여주는 역할
 */
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

/**
 * 특정 경로/파일에 대해서 `updateCallback` 를 수행 후
 * 모든 수행이 끝난 후 `finishCallback` 를 걸린시간 인자를 넣어서 호출한다.
 * @param path 업데이트를 시작할 경로 또는 파일이름
 * @param updateCallback 
 * @param finishCallback 
 */
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

/**
 * 상위 경로로 올라가면해 원하는 파일을 찾음
 * @param findpath 찾기 시작할 디렉토리
 * @param filename 원하는 파일
 * @returns 파일의 실제 경로
 */
export function findFile(findpath:string, filename:string) 
{
  findpath = path.normalize(findpath).replace(/\//gi, '/');

  for(let i = 0; i < 20; i++)
  {
    const cur = path.join(findpath, filename)
    if(fs.existsSync(cur))
    {
      return cur;
    }
    findpath = findpath.substring(0, findpath.lastIndexOf('/'));
  }
}