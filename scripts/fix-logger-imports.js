#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src');

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else if (dirent.name.endsWith('.ts')) {
      yield res;
    }
  }
}

async function fixLoggerImports() {
  for await (const filePath of getFiles(srcDir)) {
    let content = await readFile(filePath, 'utf8');
    
    // Fix logger imports
    content = content.replace(
      /import\s*{\s*logger\s*}\s*from\s*(['"])\.\.?\/.*?\/logger\.js['"]/g,
      (match, quote) => {
        // Calculate relative path to utils/logger.js from current file
        const relativePath = join(
          dirname(filePath.replace(srcDir, '')),
          '..',
          'utils/logger.js'
        ).replace(/\\/g, '/');
        return `import logger from '${relativePath}'`;
      }
    );

    await writeFile(filePath, content);
    console.log(`Fixed logger imports in ${filePath}`);
  }
}

fixLoggerImports().catch(console.error); 