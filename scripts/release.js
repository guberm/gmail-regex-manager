#!/usr/bin/env node
/**
 * Release script: semantic version bump + CHANGELOG append + git tag
 * Usage: node scripts/release.js [major|minor|patch] "Description of changes"
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function readJSON(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJSON(p,obj){ fs.writeFileSync(p, JSON.stringify(obj, null, 2)+'\n'); }

function run(cmd){ return execSync(cmd,{stdio:'inherit'}); }

function bumpVersion(version, level){
  const parts = version.split('.').map(Number);
  if(level==='major'){ parts[0]++; parts[1]=0; parts[2]=0; }
  else if(level==='minor'){ parts[1]++; parts[2]=0; }
  else { parts[2]++; }
  return parts.join('.');
}

function updateManifestVersion(manifestPath, newVersion){
  const manifest = readJSON(manifestPath);
  manifest.version = newVersion;
  writeJSON(manifestPath, manifest);
}

function appendChangelog(changelogPath, newVersion, description){
  const date = new Date().toISOString().split('T')[0];
  const entry = `\n## v${newVersion} - ${date}\n\n${description}\n`;
  fs.appendFileSync(changelogPath, entry);
}

function main(){
  const level = process.argv[2] || 'patch';
  const description = process.argv.slice(3).join(' ') || 'Maintenance updates.';
  if(!['major','minor','patch'].includes(level)){
    console.error('Level must be one of: major, minor, patch'); process.exit(1);
  }
  const pkgPath = path.join(process.cwd(),'package.json');
  const manifestPath = path.join(process.cwd(),'manifest.json');
  const changelogPath = path.join(process.cwd(),'CHANGELOG.md');
  const pkg = readJSON(pkgPath);
  const oldVersion = pkg.version;
  const newVersion = bumpVersion(oldVersion, level);
  pkg.version = newVersion;
  writeJSON(pkgPath, pkg);
  updateManifestVersion(manifestPath, newVersion);
  appendChangelog(changelogPath, newVersion, description);
  run('git add package.json manifest.json CHANGELOG.md');
  run(`git commit -m "chore(release): v${newVersion}"`);
  run(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`\nRelease v${newVersion} prepared. Run: git push && git push --tags`);
}

main();
