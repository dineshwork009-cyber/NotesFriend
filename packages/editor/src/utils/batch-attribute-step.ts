import { Step, StepResult } from "@tiptap/pm/transform";
import { Node, Schema, Fragment } from "@tiptap/pm/model";
import { Mapping } from "@tiptap/pm/transform";

export interface AttributeUpdate {
  pos: number;
  attrName: string;
  value: any;
}

export class BatchAttributeStep extends Step {
  constructor(public updates: AttributeUpdate[]) {
    super();
  }

  apply(doc: Node): StepResult {
    const updateMap = new Map<number, Map<string, any>>();

    for (const update of this.updates) {
      if (!updateMap.has(update.pos)) {
        updateMap.set(update.pos, new Map());
      }
      updateMap.get(update.pos)!.set(update.attrName, update.value);
    }

    const newDoc = doc.copy(this.updateContent(doc.content, 0, updateMap));

    return StepResult.ok(newDoc);
  }

  private updateContent(
    content: Fragment,
    startPos: number,
    updateMap: Map<number, Map<string, any>>
  ): Fragment {
    const nodes: Node[] = [];
    let pos = startPos;

    content.forEach((node: Node) => {
      const nodePos = pos;
      const attrs = updateMap.get(nodePos);

      if (attrs) {
        const newAttrs = { ...node.attrs };
        for (const [attrName, value] of attrs.entries()) {
          newAttrs[attrName] = value;
        }

        const newContent = node.isLeaf
          ? node.content
          : this.updateContent(node.content, pos + 1, updateMap);

        nodes.push(node.type.create(newAttrs, newContent, node.marks));
      } else {
        if (!node.isLeaf && node.content.size > 0) {
          const newContent = this.updateContent(
            node.content,
            pos + 1,
            updateMap
          );
          nodes.push(node.copy(newContent));
        } else {
          nodes.push(node);
        }
      }

      pos += node.nodeSize;
    });

    return Fragment.from(nodes);
  }

  invert(doc: Node): Step {
    const inverseUpdates: AttributeUpdate[] = [];

    for (const update of this.updates) {
      const node = doc.nodeAt(update.pos);
      if (node) {
        inverseUpdates.push({
          pos: update.pos,
          attrName: update.attrName,
          value: node.attrs[update.attrName]
        });
      }
    }

    return new BatchAttributeStep(inverseUpdates);
  }

  map(mapping: Mapping): Step | null {
    const mappedUpdates: AttributeUpdate[] = [];

    for (const update of this.updates) {
      const mappedPos = mapping.map(update.pos);

      if (mappedPos === null || mappedPos === undefined) {
        continue;
      }

      mappedUpdates.push({
        pos: mappedPos,
        attrName: update.attrName,
        value: update.value
      });
    }

    if (mappedUpdates.length === 0) {
      return null;
    }

    return new BatchAttributeStep(mappedUpdates);
  }

  toJSON() {
    return {
      stepType: "batchAttribute",
      updates: this.updates
    };
  }

  static fromJSON(_: Schema, json: any): BatchAttributeStep {
    return new BatchAttributeStep(json.updates);
  }
}

Step.jsonID("batchAttribute", BatchAttributeStep);
