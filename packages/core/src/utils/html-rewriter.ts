import { Parser } from "htmlparser2";

type OnTagHandler = (
  name: string,
  attr: Record<string, string>,
  pos: { start: number; end: number }
) =>
  | false
  | { name: string; attr: Record<string, string> }
  | null
  | undefined
  | void;

export class HTMLRewriter {
  private transformed = "";
  private currentTag: string | null = null;
  private ignoreIndex: number | null = null;
  private parser: Parser;

  constructor(
    options: {
      ontag?: OnTagHandler;
    } = {}
  ) {
    const { ontag } = options;

    /**
     * @private
     */
    this.parser = new Parser(
      {
        onreset: () => {
          this.transformed = "";
        },
        oncomment: () => this.write("<!--"),
        oncommentend: () => this.write("-->"),
        onopentag: (name, attr) => {
          if (this.ignoreIndex !== null) {
            this.ignoreIndex++;
            return;
          }

          this.closeTag();

          if (ontag) {
            const result = ontag(name, attr, {
              start: this.parser.startIndex,
              end: this.parser.endIndex
            });

            if (result === false) {
              this.ignoreIndex = 0;
              return;
            } else if (result === null) return;
            else if (result) {
              name = result.name;
              attr = result.attr;
            }
          }

          this.write(`<${name}`);
          if (attr) {
            for (const key in attr) {
              if (!key) continue;
              this.write(` ${key}="${attr[key]}"`);
            }
          }
          this.currentTag = name;
        },
        onclosetag: (name, isImplied) => {
          if (this.ignoreIndex === 0) {
            this.ignoreIndex = null;
            return;
          }

          if (this.ignoreIndex !== null) {
            this.ignoreIndex--;
            return;
          }

          if (!isImplied) this.closeTag();

          this.write(isImplied ? "/>" : `</${name}>`);

          if (this.currentTag) {
            this.currentTag = null;
          }
        },
        ontext: (data) => {
          if (this.ignoreIndex !== null) {
            return;
          }

          this.closeTag();

          this.write(data);
        }
      },
      {
        recognizeSelfClosing: true,
        xmlMode: false,
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
        recognizeCDATA: false
      }
    );
  }

  /**
   * @private
   */
  closeTag() {
    if (this.currentTag) {
      this.write(">");
      this.currentTag = null;
    }
  }

  transform(html: string) {
    this.parser.end(html);
    return this.transformed;
  }

  end() {
    this.parser.reset();
  }

  private write(html: string) {
    this.transformed += html;
  }
}
