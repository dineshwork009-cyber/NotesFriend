import { Deflate as FflateDeflate, Inflate as FflateInflate } from "fflate";

function initShimAsyncCodec(library, options = {}, registerDataHandler) {
  return {
    Deflate: createCodecClass(
      library.Deflate,
      options.deflate,
      registerDataHandler
    ),
    Inflate: createCodecClass(
      library.Inflate,
      options.inflate,
      registerDataHandler
    )
  };
}

function objectHasOwn(object, propertyName) {
  // eslint-disable-next-line no-prototype-builtins
  return typeof Object.hasOwn === "function"
    ? Object.hasOwn(object, propertyName)
    : // eslint-disable-next-line no-prototype-builtins
      object.hasOwnProperty(propertyName);
}

function createCodecClass(
  constructor,
  constructorOptions,
  registerDataHandler
) {
  return class {
    constructor(options) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const codecAdapter = this;
      const onData = (data) => {
        if (codecAdapter.pendingData) {
          const previousPendingData = codecAdapter.pendingData;
          codecAdapter.pendingData = new Uint8Array(
            previousPendingData.length + data.length
          );
          const { pendingData } = codecAdapter;
          pendingData.set(previousPendingData, 0);
          pendingData.set(data, previousPendingData.length);
        } else {
          codecAdapter.pendingData = new Uint8Array(data);
        }
      };
      if (objectHasOwn(options, "level") && options.level === undefined) {
        delete options.level;
      }
      codecAdapter.codec = new constructor(
        Object.assign({}, constructorOptions, options)
      );
      registerDataHandler(codecAdapter.codec, onData);
    }
    append(data) {
      this.codec.push(data);
      return getResponse(this);
    }
    flush() {
      this.codec.push(new Uint8Array(), true);
      return getResponse(this);
    }
  };

  function getResponse(codec) {
    if (codec.pendingData) {
      const output = codec.pendingData;
      codec.pendingData = null;
      return output;
    } else {
      return new Uint8Array();
    }
  }
}

const { Deflate, Inflate } = initShimAsyncCodec(
  { Deflate: FflateDeflate, Inflate: FflateInflate },
  undefined,
  (codec, onData) => (codec.ondata = onData)
);
export { Deflate, Inflate };
