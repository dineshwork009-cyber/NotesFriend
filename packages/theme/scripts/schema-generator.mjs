import { writeFile } from "fs/promises";
import path from "path";
import tsj from "ts-json-schema-generator";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generator = tsj.createGenerator({
  path: path.join(__dirname, "..", "src", "theme-engine", "types.ts"),
  tsconfig: path.join(__dirname, "..", "tsconfig.json"),
  type: "ThemeDefinition"
});

const schema = generator.createSchema("ThemeDefinition");

removeProperty("ThemeDefinition", "codeBlockCSS");
addProperty(
  "ThemeDefinition",
  "$schema",
  {
    type: "string",
    const:
      "https://raw.githubusercontent.com/streetwriters/notesfriend-themes/main/schemas/v1.schema.json"
  },
  true
);
makePropertyOptional("Colors", "shade");
makePropertyOptional("PartialOrFullColors<false>", "shade");
makePropertyOptional("Colors", "textSelection");
makePropertyOptional("PartialOrFullColors<false>", "textSelection");
await writeFile(`v1.schema.json`, JSON.stringify(schema, undefined, 2));

function removeProperty(definition, propertyName) {
  delete schema.definitions[definition].properties[propertyName];
  makePropertyOptional(definition, propertyName);
}

function makePropertyOptional(definition, propertyName) {
  const required = schema.definitions[definition].required;
  if (required && required.includes(propertyName)) {
    required.splice(required.indexOf(propertyName), 1);
  }
}

function addProperty(definition, propertyName, value, required) {
  schema.definitions[definition].properties[propertyName] = value;
  if (required) {
    schema.definitions[definition].required.push(propertyName);
  }
}
