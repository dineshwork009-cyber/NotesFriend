const zlib = require("zlib");
const utils = require("util");

const gzipAsync = utils.promisify(zlib.gzip);
const gunzipAsync = utils.promisify(zlib.gunzip);

async function compress(data) {
  return (await gzipAsync(data, { level: 6 })).toString("base64");
}

async function decompress(data) {
  return (await gunzipAsync(Buffer.from(data, "base64"))).toString("utf-8");
}

module.exports = {
  compress,
  decompress
};
