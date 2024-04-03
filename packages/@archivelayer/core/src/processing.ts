import {
  requireConfigs
} from '@archivelayer/utils'

import {
  ArchiveLayerConfigs
} from './configs'

import ArchiveManager from './archive-manager.js'
import FileWatcher from './file-watcher.js'


export async function Startup() 
{
  const configs = await requireConfigs<ArchiveLayerConfigs>();
  
  if(configs.sourcePath === undefined) return;
  
  const archiveManager = new ArchiveManager();
  archiveManager.initialize(configs);
  
  const watcher = new FileWatcher(
    configs.sourcePath, 
    (fileName)=>{archiveManager.fileUpdated(fileName)},
    (fileName)=>{archiveManager.fileRemoved(fileName)}
  ); 
}

export async function Build()
{
  const configs = await requireConfigs<ArchiveLayerConfigs>();
  
  if(configs.sourcePath === undefined) return;
  
  const archiveManager = new ArchiveManager();
  archiveManager.initialize(configs);  
}