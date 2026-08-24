import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirectories = new Set([".git", "dist", "node_modules"]);

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findMarkdownFiles(entryPath));
    } else if (entry.isFile() && extname(entry.name).toLowerCase() === ".md") {
      files.push(entryPath);
    }
  }

  return files;
}

function withoutFencedCode(markdown) {
  return markdown.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm, "");
}

function localLinkTargets(markdown) {
  const targets = [];
  const linkPattern = /!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;

  for (const match of withoutFencedCode(markdown).matchAll(linkPattern)) {
    const target = match[1] || match[2];
    if (!target || target.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(target)) {
      continue;
    }
    targets.push(target);
  }

  return targets;
}

function headingAnchors(markdown) {
  const anchors = new Set();
  const occurrences = new Map();

  for (const line of withoutFencedCode(markdown).split("\n")) {
    const match = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const base = match[1]
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[\u2018\u2019'"`*_~()[\]{}:;,.!?/\\|<>+=&@#$%^]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const occurrence = occurrences.get(base) || 0;
    occurrences.set(base, occurrence + 1);
    anchors.add(occurrence ? `${base}-${occurrence}` : base);
  }

  return anchors;
}

function displayPath(filePath) {
  return relative(projectDirectory, filePath).split(sep).join("/");
}

const markdownFiles = await findMarkdownFiles(projectDirectory);
const errors = [];
const headingCache = new Map();
let checkedLinks = 0;

for (const sourceFile of markdownFiles) {
  const markdown = await readFile(sourceFile, "utf8");

  for (const rawTarget of localLinkTargets(markdown)) {
    checkedLinks += 1;
    const [encodedPath, encodedFragment] = rawTarget.split("#", 2);
    let targetPath;
    let fragment;

    try {
      targetPath = resolve(dirname(sourceFile), decodeURIComponent(encodedPath));
      fragment = encodedFragment ? decodeURIComponent(encodedFragment).toLowerCase() : "";
    } catch {
      errors.push(`${displayPath(sourceFile)}: invalid URL encoding in ${rawTarget}`);
      continue;
    }

    const relativeTarget = relative(projectDirectory, targetPath);
    if (relativeTarget.startsWith(`..${sep}`) || relativeTarget === "..") {
      errors.push(`${displayPath(sourceFile)}: link leaves the repository: ${rawTarget}`);
      continue;
    }

    try {
      await access(targetPath);
    } catch {
      errors.push(`${displayPath(sourceFile)}: missing local target: ${rawTarget}`);
      continue;
    }

    if (!fragment || extname(targetPath).toLowerCase() !== ".md") continue;

    if (!headingCache.has(targetPath)) {
      headingCache.set(
        targetPath,
        headingAnchors(await readFile(targetPath, "utf8"))
      );
    }

    if (!headingCache.get(targetPath).has(fragment)) {
      errors.push(`${displayPath(sourceFile)}: missing heading in ${rawTarget}`);
    }
  }
}

if (errors.length) {
  console.error("Documentation link validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Documentation links are valid: ${markdownFiles.length} files, ${checkedLinks} local links.`
  );
}
