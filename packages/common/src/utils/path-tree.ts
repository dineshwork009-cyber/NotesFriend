import { join, parse } from "pathe";

interface TreeNode extends Record<string, TreeNode> {}
type UniquifyStrategy = "number" | "underscore";

export class PathTree {
  private root: TreeNode;

  constructor() {
    this.root = {};
  }

  add(path: string, strategy: UniquifyStrategy = "number"): string {
    const { parts, ext, dir, name } = this.parse(path);
    let node = this.root;

    for (const part of parts) {
      if (node[part]) node = node[part];
      else node = node[part] = {};
    }

    const newName = this.uniquify(strategy, node, name, ext);
    node[newName.toLowerCase()] = {};
    return join(dir, newName);
  }

  exists(path: string): boolean {
    const { parts, name, ext } = this.parse(path);
    let node = this.root;

    for (const part of parts) {
      if (!node[part]) return false;
      node = node[part];
    }

    return !!node[`${name}${ext}`.toLowerCase()];
  }

  private uniquify(
    strategy: UniquifyStrategy,
    node: TreeNode,
    name: string,
    ext: string
  ) {
    switch (strategy) {
      case "number": {
        let index = 1;
        let newName = name + ext;
        while (node[newName.toLowerCase()])
          newName = `${name}_${index++}${ext}`;
        return newName;
      }
      case "underscore": {
        let newName = name + ext;
        while (node[newName.toLowerCase()]) newName = `_${newName}`;
        return newName;
      }
    }
  }

  private parse(path: string): {
    parts: string[];
    dir: string;
    ext: string;
    name: string;
  } {
    const { dir, name, ext } = parse(path);

    return {
      parts:
        dir === "."
          ? []
          : dir
              // case insensitive
              .toLowerCase()
              // Handle both Unix-like and Windows paths
              .split(/[\\/]/)
              .filter((part) => !!part.trim()),
      dir,
      ext,
      name
    };
  }
}
