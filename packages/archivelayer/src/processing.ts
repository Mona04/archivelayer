import {
  requireConfigs
} from '@archivelayer/utils'

import {
  ArchiveLayerConfigs, 
  ArchiveManager, 
  FileWatcher
} from '@archivelayer/core'

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