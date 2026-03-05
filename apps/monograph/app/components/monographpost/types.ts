import { Cipher } from "@notesfriend/crypto";
export type Monograph = {
  title: string;
  userId: string;
  content?: {
    type: string;
    data: string;
  };
  selfDestruct: boolean;
  encryptedContent?: Cipher<"base64">;
  datePublished: string;
  id: string;
};
