#!/usr/bin/env node
/**
 * Bump version in manifest.json and package.json, commit, and optionally tag.
 * Usage: node scripts/bump-version.js 1.1.0 [--tag]
 */
const fs = require('fs');
const path = require('path');

function die(msg){ console.error(msg); process.exit(1);} 
const newVersion = process.argv[2];
if(!newVersion) die('Usage: node scripts/bump-version.js <version> [--tag]');
const doTag = process.argv.includes('--tag');

const manifestPath = path.join(process.cwd(),'manifest.json');
const pkgPath = path.join(process.cwd(),'package.json');
if(!fs.existsSync(manifestPath)) die('manifest.json not found');
if(!fs.existsSync(pkgPath)) die('package.json not found');

const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));

manifest.version = newVersion;
pkg.version = newVersion;

fs.writeFileSync(manifestPath, JSON.stringify(manifest,null,2)+"\n");
fs.writeFileSync(pkgPath, JSON.stringify(pkg,null,2)+"\n");

console.log(`Updated manifest.json and package.json to version ${newVersion}`);

if(doTag){
  const { execSync } = require('child_process');
  try {
    execSync(`git add manifest.json package.json`,{stdio:'inherit'});
    execSync(`git commit -m \"chore: bump version to v${newVersion}\"`,{stdio:'inherit'});
    execSync(`git tag -a v${newVersion} -m \"v${newVersion}\"`,{stdio:'inherit'});
    console.log(`Created annotated tag v${newVersion}`);
  } catch(e){
    die('Failed git operations; ensure git is installed and repo is clean.');
  }
} else {
  console.log('Remember to commit and tag manually if desired.');
}
