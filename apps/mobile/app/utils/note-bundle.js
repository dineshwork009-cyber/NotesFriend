import Sodium from "@ammarahmed/react-native-sodium";
import { isImage } from "@notesfriend/core";
import { Platform } from "react-native";
import RNFetchBlob from "react-native-blob-util";
import { DatabaseLogger, db } from "../common/database";
import { IOS_APPGROUPID } from "./constants";
import { compressToFile } from "../common/filesystem/compress";

const santizeUri = (uri) => {
  uri = decodeURI(uri);
  uri = Platform.OS === "ios" ? uri.replace("file:///", "/") : uri;
  return uri;
};

export async function attachFile(uri, hash, type, filename, options) {
  try {
    let exists = await db.attachments.exists(hash);
    let encryptionInfo;
    if (options?.hash && options.hash !== hash) return false;

    if (!exists || options?.reupload) {
      let key = await db.attachments.generateKey();
      encryptionInfo = await Sodium.encryptFile(key, {
        uri: uri,
        type: options.type || "url",
        hash: hash,
        appGroupId: options.appGroupId
      });
      encryptionInfo.mimeType = type;
      encryptionInfo.filename = filename;
      encryptionInfo.alg = "xcha-stream";
      encryptionInfo.key = key;

      if (options?.reupload && exists) await db.attachments.reset(hash);
    } else {
      encryptionInfo = { hash: hash };
    }
    await db.attachments.add(encryptionInfo, options?.id);
    return true;
  } catch (e) {
    if (Platform.OS === "ios")
      RNFetchBlob.fs.unlink(uri).catch(() => {
        /* empty */
      });
    DatabaseLogger.error(e, "Attach file error");

    return false;
  }
}

async function createNotes(bundle) {
  const sessionId = bundle.note.sessionId;
  const id = await db.notes.add(bundle.note);

  if (!bundle.notebooks || !bundle.notebooks.length) {
    const defaultNotebook = db.settings?.getDefaultNotebook();
    if (defaultNotebook) {
      await db.notes.addToNotebook(defaultNotebook, id);
    }
  } else {
    for (const item of bundle.notebooks) {
      await db.notes.addToNotebook(item, id);
    }
  }

  if (bundle.tags) {
    for (const tagId of bundle.tags) {
      if (await db.tags.exists(tagId)) {
        await db.relations.add(
          {
            type: "tag",
            id: tagId
          },
          {
            id: id,
            type: "note"
          }
        );
      }
    }
  }
  const compress = bundle.compress;

  for (const file of bundle.files) {
    let uri = Platform.OS === "ios" ? santizeUri(file.value) : `${file.value}`;

    const isPng = /(png)/g.test(file.type);
    const isJpeg = /(jpeg|jpg)/g.test(file.type);

    if ((isPng || isJpeg) && compress) {
      uri = await compressToFile("file://" + uri, isPng ? "PNG" : "JPEG");

      uri = `${uri.replace("file://", "")}`;
    }

    const hash = await Sodium.hashFile({
      uri: uri,
      type: "cache"
    });
    const attached = await attachFile(uri, hash, file.type, file.name, {
      type: "cache",
      id: id,
      appGroupId: IOS_APPGROUPID
    });
    let content = ``;

    if (attached) {
      if (isImage(file.type)) {
        content = `<img data-hash="${hash}" data-mime="${file.type}" data-filename="${file.name}" data-size="${file.size}" />`;
      } else {
        content = `<p><span data-hash="${hash}" data-mime="${file.type}" data-filename="${file.name}" data-size="${file.size}" /></p>`;
      }
      const note = await db.notes.note(id);
      const rawContent = await db.content.get(note?.contentId);
      await db.notes.add({
        id: id,
        content: {
          type: "tiptap",
          data: rawContent?.data ? rawContent?.data + content : content
        },
        sessionId: sessionId
      });
    }
  }
}

export const NoteBundle = {
  createNotes
};
