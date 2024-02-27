//const path = require('path')
//const { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } = require("next/constants");
//const { withContentlayer } = require('next-contentlayer')
import path from 'path'
import { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'
//import { withContentlayer } from 'next-contentlayer';
import { withContentlayer } from 'next-remote-watcher'

/**
 * @type {import('next').NextConfig}
 */
const config = (phase, { defaultConfig }) => 
{
  const __dirname = process.cwd();

  const config = {
    output: 'export',
    distDir: 'out',
    basePath: phase == PHASE_PRODUCTION_BUILD ? process.env.NEXT_PUBLIC_BASE_PATH : "",

    env: {
      //BASE_PATH: this.basePath ?? ""
    },

    sassOptions: {
      includePaths: [path.join(__dirname, 'src/app/_styles')],
    },    

    reactStrictMode: true, 
    swcMinify: true,
    trailingSlash: false,
    experimental: {
      esmExternals: 'loose'
    },
    //onDemandEntries: {
    //  // period (in ms) where the server will keep pages in the buffer
    //  maxInactiveAge: 36000 * 1000,
    //  // number of pages that should be kept simultaneously without being disposed
    //  pagesBufferLength: 10,
    //},

    //experimental: {
    //  instrumentationHook: true,
    //},
    
    /**
     * next-image-export-optimizer (ssg 지원용)
     */
    images: {
      loader: "custom",
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    env: {
      nextImageExportOptimizer_imageFolderPath: "public/",
      nextImageExportOptimizer_exportFolderPath: "out",
      nextImageExportOptimizer_quality: "75",
      nextImageExportOptimizer_storePicturesInWEBP: "true",
      nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
      
      // If you do not want to use blurry placeholder images, then you can set
      // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
      // `placeholder="empty"` to all <ExportedImage> components.
      nextImageExportOptimizer_generateAndUseBlurImages: "true",
    },
    transpilePackages: ["next-image-export-optimizer", "next-contentlayer", "@contentlayer/client", "@contentlayer"],
    
    
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
      if(isServer){
        if(nextRuntime == 'nodejs'){
        }
      }
      else{
        if(dev){        
        }
      }

      return config
    },
  };

  return withContentlayer(config);
}

//module.exports = config;
export default config;