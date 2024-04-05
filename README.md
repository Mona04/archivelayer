# ArchiveLayer

The ContentLayer of Stackbit has not been maintained for a while. 

Although there are many alternatives, such as ```next/mdx```, I think the output structure of Contentlayer is appealing. 

So I made a simple and lightweight version of Contentlayer.

## How to use.

You need ```archivelayer.config.js``` in your base directory. See ```tests/next-test/archivelayer.config.js```

To compile all the markdown / mdx files, execute a script like the following ```"archivelayer dev"```.

If you want the file to reflect edits, execute a script like the following ```"concurrently \"archivelayer dev\" \"next dev -p 4000\""```

Then, archivelayer compiles the file and saves in ```.archivelayer/generated```. 

It is an auto generated module you can import.