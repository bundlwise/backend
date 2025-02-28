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

async function fixImports() {
  for await (const filePath of getFiles(srcDir)) {
    let content = await readFile(filePath, 'utf8');
    
    // Remove any existing .js extensions first
    content = content.replace(
      /(from\s+['"]\.\.?\/[^'"]*?)\.js(['"])/g,
      '$1$2'
    );
    
    // Add .js extension to relative imports (but not node_modules)
    content = content.replace(
      /(from\s+['"]\.\.?\/[^'"]*?)(['"])/g,
      (match, p1, p2) => {
        // Don't add .js if it's already a file extension
        if (p1.match(/\.(ts|js|json)$/)) return match;
        return `${p1}.js${p2}`;
      }
    );

    // Fix import assertions for JSON files
    content = content.replace(
      /(from\s+['"]\.\.?\/.*?\.json['"])/g,
      '$1 assert { type: "json" }'
    );

    await writeFile(filePath, content);
    console.log(`Fixed imports in ${filePath}`);
  }
}

fixImports().catch(console.error); 