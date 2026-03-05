import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export type CLIOptions = {
  note: boolean | string;
  notebook: boolean | string;
  reminder: boolean | string;
  hidden: boolean;
};

export async function parseArguments(argv: string[]): Promise<CLIOptions> {
  const result: CLIOptions = {
    note: false,
    notebook: false,
    reminder: false,
    hidden: false
  };
  const { hidden } = await yargs(hideBin(argv))
    .boolean("hidden")
    // have to account for this flag added on Windows when launching
    // via Jumplist
    .boolean("allow-file-access-from-files")
    .command("new", "Create a new item", (yargs) => {
      return yargs
        .command("note", "Create a new note", {}, () => {
          result.note = true;
          console.log("HERE!");
        })
        .command("notebook", "Create a new notebook", {}, () => {
          result.notebook = true;
        })
        .command("reminder", "Add a new reminder", {}, () => {
          result.reminder = true;
        });
    })
    .command("open", "Open a specific item", (yargs) => {
      return yargs
        .command(
          "note",
          "Open a note",
          { id: { string: true, description: "Id of the note" } },
          (args) => {
            result.note = args.id || false;
          }
        )
        .command(
          "notebook",
          "Open a notebook",
          { id: { string: true, description: "Id of the notebook" } },
          (args) => {
            result.notebook = args.id || false;
          }
        )
        .command(
          "topic",
          "Open a topic",
          {
            id: { string: true, description: "Id of the topic" },
            notebookId: { string: true, description: "Id of the notebook" }
          },
          (args) => {
            result.notebook = `${args.notebookId}/${args.id}`;
          }
        );
    })
    .parse();
  result.hidden = hidden || false;
  return result;
}
