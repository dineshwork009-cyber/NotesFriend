import { StringOutputFormat, Uint8ArrayOutputFormat } from "@notesfriend/sodium";

export type DataFormat = Uint8ArrayOutputFormat | StringOutputFormat;

export type Cipher<TFormat extends DataFormat> = {
  format: TFormat;
  alg: string;
  cipher: Output<TFormat>;
  iv: string;
  salt: string;
  length: number;
};

export type AsymmetricCipher<TFormat extends DataFormat> = Omit<
  Cipher<TFormat>,
  "iv" | "salt"
>;

export type Output<TFormat extends DataFormat> =
  TFormat extends StringOutputFormat ? string : Uint8Array;
export type Input<TFormat extends DataFormat> = Output<TFormat>;

export type SerializedKey = {
  password?: string;
  key?: string;
  salt?: string;
};

export type EncryptionKey = {
  key: Uint8Array;
  salt: string;
};

export type Chunk = {
  data: Uint8Array;
  final: boolean;
};

export type EncryptionKeyPair = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
};

export type SerializedKeyPair = {
  publicKey: string;
  privateKey: string;
};
