import {
  Cipher,
  EncryptionKey,
  DataFormat,
  SerializedKey,
  Chunk,
  Output,
  Input,
  EncryptionKeyPair,
  SerializedKeyPair,
  AsymmetricCipher
} from "./types.js";

export interface IStreamable {
  read(): Promise<Chunk | undefined>;
  write(chunk: Chunk | undefined): Promise<void>;
}

export interface INNCrypto {
  encrypt<TOutputFormat extends DataFormat>(
    key: SerializedKey,
    data: Input<DataFormat>,
    format: DataFormat,
    outputFormat?: TOutputFormat
  ): Promise<Cipher<TOutputFormat>>;

  encryptMulti<TOutputFormat extends DataFormat>(
    key: SerializedKey,
    data: Input<DataFormat>[],
    format: DataFormat,
    outputFormat?: TOutputFormat
  ): Promise<Cipher<TOutputFormat>[]>;

  decrypt<TOutputFormat extends DataFormat>(
    key: SerializedKey,
    cipherData: Cipher<DataFormat>,
    outputFormat?: TOutputFormat
  ): Promise<Output<TOutputFormat>>;

  decryptMulti<TOutputFormat extends DataFormat>(
    key: SerializedKey,
    cipherData: Cipher<DataFormat>[],
    outputFormat?: TOutputFormat
  ): Promise<Output<TOutputFormat>[]>;

  decryptAsymmetric<TOutputFormat extends DataFormat>(
    keyPair: SerializedKeyPair,
    cipherData: AsymmetricCipher<DataFormat>,
    outputFormat?: TOutputFormat
  ): Promise<Output<TOutputFormat>>;

  hash(password: string, salt: string): Promise<string>;

  deriveKey(password: string, salt?: string): Promise<EncryptionKey>;

  deriveKeyPair(): Promise<EncryptionKeyPair>;

  exportKey(password: string, salt?: string): Promise<SerializedKey>;

  exportKeyPair(): Promise<SerializedKeyPair>;

  createEncryptionStream(
    key: SerializedKey
  ): Promise<{ iv: string; stream: TransformStream<Chunk, Uint8Array> }>;

  createDecryptionStream(
    key: SerializedKey,
    iv: string
  ): Promise<TransformStream<Uint8Array, Uint8Array>>;
}
