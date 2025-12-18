/*

   ~ Shota BASED
  > Jangan lupa baca README.md <

*/

process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

import "./settings.js"
import "./lib/function.js"
import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	useMultiFileAuthState,
	fetchLatestWaWebVersion,
	DisconnectReason,
	fetchLatestBaileysVersion,
	generateForwardMessageContent,
	prepareWAMessageMedia,
	generateWAMessageFromContent,
	generateMessageID,
	downloadContentFromMessage,
	makeInMemoryStore,
	getContentType,
	jidDecode,
	delay,
	Browsers
} from "@whiskeysockets/baileys"

// ** import module **
import fs from "fs";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";
import pkg from "cfonts";
const { say } = pkg;
import pino from 'pino';
import { Boom } from '@hapi/boom';
import path from "path";
import readline from "readline"
import axios from "axios";
import qrcode from "qrcode-terminal";
import { fileTypeFromBuffer } from "file-type";
import os from 'os';
import nou from 'node-os-utils';
import speed from 'performance-now';

const timestamp = speed();
const latensi = speed() - timestamp;
const tio = nou.os.oos();
const tot = await nou.drive.info();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ** import file utama **
import { caseHandler } from "./main/handle.js"; // sesuaikan aja
    
import { imageToWebp, videoToWebp, writeExifImg, writeExifVid } from './lib/webp.js';
import ConfigBaileys from "./lib/config.js";

const set = JSON.parse(fs.readFileSync('./data/setbot.json'));

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function InputNumber(promptText) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

const pairingCode = true
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('Auth');
    const { version, isLatest } = await fetchLatestWaWebVersion();
    
    const sock = makeWASocket({
        browser: Browsers.ubuntu("Firefox"),  
        generateHighQualityLinkPreview: true,  
        printQRInTerminal: !pairingCode,
        auth: state,        
        version: version,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return sock
        },
        logger: pino({ level: "silent" })
    });
    
    store?.bind(sock.ev)
    console.clear();
    
    if (pairingCode && !sock.authState.creds.registered) {
    let phoneNumber = await InputNumber(chalk.cyan.bold('[!] -  Enter your number, Example 628:\n'));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
        setTimeout(async () => {
        const code = await sock.requestPairingCode(phoneNumber, global.pairingKode)
        const pair = code.slice(0, 4) + "-" + code.slice(4, 8)
        console.clear();
        await console.log(`${chalk.white.bold('[✓] - Your code')} : ${chalk.green.bold(pair)}`)
        }, 5000)
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      if (!connection) return;
      if (connection === "connecting") {                     
      if (qr && !pairingCode) {
      console.log("Scan QR ini di WhatsApp:");
      qrcode.generate(qr, { small: true }); 
         }
        }
      if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.error(lastDisconnect.error);

      switch (reason) {
       case DisconnectReason.badSession:
          console.log("Bad Session File, Please Delete Session and Scan Again");
          process.exit();
        case DisconnectReason.connectionClosed:
          console.log("[SYSTEM] Connection closed, reconnecting...");
          await startBot();
        case DisconnectReason.connectionLost:
          console.log("[SYSTEM] Connection lost, trying to reconnect...");
          await startBot();
        case DisconnectReason.connectionReplaced:
          console.log("Connection Replaced, Another New Session Opened. Please Close Current Session First.");
          await sock.logout();
        break;
        case DisconnectReason.restartRequired:
          console.log("Restart Required...");
          await startBot();
        case DisconnectReason.loggedOut:
          console.log("Device Logged Out, Please Scan Again And Run.");
          await sock.logout();
        break;
        case DisconnectReason.timedOut:
          console.log("Connection TimedOut, Reconnecting...");
          await startBot();
        default:
        if (lastDisconnect.error === "Error: Stream Errored (unknown)") {
        process.exit();
        }
      }
    } else if (connection === "open") {
      console.clear()
      await startCode(sock); 
      try {
      sock.newsletterFollow("120363403075886973@newsletter")
      } catch {}
      try {
      sock.newsletterFollow("120363420360528990@newsletter")
      } catch {}
     
     // ** log in panel **
     console.clear();
  console.log(chalk.green.bold(`\n[✓] - This script has been connected to your WhatsApp!\n`))
  
  const botNumber = sock?.user?.id?.split(':')[0] || sock?.user?.jid?.replace('@s.whatsapp.net', '') || 'Unknown';
  const botName = sock?.user?.name || 'Unknown';
  
  console.log(chalk.white(`\n────────────────────────`) +
    chalk.magenta.bold(`\nInfo Pengguna:`) +
    chalk.white.bold(`
  [+] - Number : ${botNumber}
  [+] - Name   : ${botName}`));

  console.log(chalk.white(`\n────────────────────────`) +
    chalk.magenta.bold(`\nInfo Script:`) +
    chalk.white.bold(`
  [+] - Name       : ${global.namaBot}
  [+] - Developer  : ${global.namaOwner}
  [+] - Type       : Plugins (ESM)`));

  console.log(chalk.white(`\n────────────────────────`) +
    chalk.magenta.bold(`\nPlatform Runtime:`) +
    chalk.white.bold(`
  [+] - Runtime VPS   : ${runtime(os.uptime())}
  [+] - Platform      : ${nou.os.type()}
  [+] - Total RAM     : ${formatp(os.totalmem())}
  [+] - Total DISK    : ${tot.totalGb} GB
  [+] - Total CPU     : ${os.cpus().length} Core`));

  console.log(chalk.white(`\n────────────────────────\n`));
}
});

sock.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    const msg = chatUpdate.messages[0];
    if (!msg.message) return;

    const m = await ConfigBaileys(sock, msg);

    const isOwner =
      (Array.isArray(global.owner2)
        ? global.owner2.map(n => n + "@s.whatsapp.net").includes(m.sender)
        : m.sender === global.owner2 + "@s.whatsapp.net") ||
      m.key.fromMe;

    const settingsPath = path.join(__dirname, "./data/setbot.json");
    const set = JSON.parse(fs.readFileSync(settingsPath));
    if (m.isBaileys) return;
    if (!set.botActive && !isOwner) return;
   
    caseHandler(sock, m, chatUpdate);
  } catch (err) {
    console.log("Error on message:", err);
  }
});
    
    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };
    
sock.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
  try {
    const quoted = message.msg ? message.msg : message;
    const mime = (message.msg || message).mimetype || "";
    const messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];

    const Randoms = Date.now();
    const fil = Randoms;

    // pastikan folder ./data/trash ada
    if (!fs.existsSync("./data/trash")) {
      fs.mkdirSync("./data/trash", { recursive: true });
    }

    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const type = (await fileTypeFromBuffer(buffer)) || { ext: "bin", mime: "application/octet-stream" };
    const trueFileName = attachExtension
      ? `./data/trash/${fil}.${type.ext}`
      : filename || `./data/trash/${fil}.${type.ext}`;

    fs.writeFileSync(trueFileName, buffer);

    return trueFileName;
  } catch (err) {
    console.error("Error saat download media:", err);
    return null;
  }
};

   sock.downloadM = async (m, type, filename = '') => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
        }
        if (filename) await fs.promises.writeFile(filename, buffer)
        return filename && fs.existsSync(filename) ? filename : buffer
   }
   
   
   sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
    } else {
        buffer = await imageToWebp(buff);
    }

    await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };

    sock.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
    } else {
        buffer = await videoToWebp(buff);
    }

    await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };
    
    sock.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)

        let type = await fileTypeFromBuffer(data) || {
          mime: "application/octet-stream",
          ext: "bin"
        };
        
        filename = path.join(__filename, './data/trash/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename,
        data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    sock.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await sock.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;
  
  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await sock.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await sock.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}

    sock.sendContact = async (jid, kon = [], name, desk = "Developer Bot", quoted = '', opts = {}) => {
    const list = kon.map(i => ({
      displayName: typeof name !== 'undefined' ? name : 'Unknown',
      vcard:
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        `N:;${name || 'Unknown'};;;\n` +
        `FN:${name || 'Unknown'}\n` +
        'ORG:Unknown\n' +
        'TITLE:\n' +
        `item1.TEL;waid=${i}:${i}\n` +
        'item1.X-ABLabel:Ponsel\n' +
        `X-WA-BIZ-DESCRIPTION:${desk}\n` +
        `X-WA-BIZ-NAME:${name || 'Unknown'}\n` +
        'END:VCARD'
    }));

    await sock.sendMessage(
      jid,
      { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts },
      { quoted }
    );
   }
 }

startBot();

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});async function InputNumber(promptText) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

const pairingCode = true
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('Auth');
    const { version, isLatest } = await fetchLatestWaWebVersion();
    
    const sock = makeWASocket({
        browser: Browsers.ubuntu("Firefox"),  
        generateHighQualityLinkPreview: true,  
        printQRInTerminal: !pairingCode,
        auth: state,        
        version: version,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return sock
        },
        logger: pino({ level: "silent" })
    });
    
    store?.bind(sock.ev)
    console.clear();
    
    if (pairingCode && !sock.authState.creds.registered) {
    let phoneNumber = await InputNumber(chalk.cyan.bold('[!] -  Enter your number, Example 628:\n'));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
        setTimeout(async () => {
        const code = await sock.requestPairingCode(phoneNumber, global.pairingKode)
        const pair = code.slice(0, 4) + "-" + code.slice(4, 8)
        console.clear();
        await console.log(`${chalk.white.bold('[✓] - Your code')} : ${chalk.green.bold(pair)}`)
        }, 5000)
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      if (!connection) return;
      if (connection === "connecting") {                     
      if (qr && !pairingCode) {
      console.log("Scan QR ini di WhatsApp:");
      qrcode.generate(qr, { small: true }); 
         }
        }
      if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.error(lastDisconnect.error);

      switch (reason) {
       case DisconnectReason.badSession:
          console.log("Bad Session File, Please Delete Session and Scan Again");
          process.exit();
        case DisconnectReason.connectionClosed:
          console.log("[SYSTEM] Connection closed, reconnecting...");
          await startBot();
        case DisconnectReason.connectionLost:
          console.log("[SYSTEM] Connection lost, trying to reconnect...");
          await startBot();
        case DisconnectReason.connectionReplaced:
          console.log("Connection Replaced, Another New Session Opened. Please Close Current Session First.");
          await sock.logout();
        break;
        case DisconnectReason.restartRequired:
          console.log("Restart Required...");
          await startBot();
        case DisconnectReason.loggedOut:
          console.log("Device Logged Out, Please Scan Again And Run.");
          await sock.logout();
        break;
        case DisconnectReason.timedOut:
          console.log("Connection TimedOut, Reconnecting...");
          await startBot();
        default:
        if (lastDisconnect.error === "Error: Stream Errored (unknown)") {
        process.exit();
        }
      }
    } else if (connection === "open") {
      console.clear()
      await startCode(sock); 
      try {
      sock.newsletterFollow("120363403075886973@newsletter")
      } catch {}
      try {
      sock.newsletterFollow("120363420360528990@newsletter")
      } catch {}
     
     // ** log in panel **
     console.clear();
  console.log(chalk.green.bold(`\n[✓] - This script has been connected to your WhatsApp!\n`))
  
  const botNumber = sock?.user?.id?.split(':')[0] || sock?.user?.jid?.replace('@s.whatsapp.net', '') || 'Unknown';
  const botName = sock?.user?.name || 'Unknown';
  
  console.log(chalk.white(`\n────────────────────────`) +
    chalk.magenta.bold(`\nInfo Pengguna:`) +
    chalk.white.bold(`
  [+] - Number : ${botNumber}
  [+] - Name   : ${botName}`));

  console.log(chalk.white(`\n────────────────────────`) +
    chalk.magenta.bold(`\nInfo Script:`) +
    chalk.white.bold(`
  [+] - Name       : ${global.namaBot}
  [+] - Developer  : ${global.namaOwner}
  [+] - Type       : Plugins (ESM)`));

  console.log(chalk.white(`\n────────────────────────`) +
    chalk.magenta.bold(`\nPlatform Runtime:`) +
    chalk.white.bold(`
  [+] - Runtime VPS   : ${runtime(os.uptime())}
  [+] - Platform      : ${nou.os.type()}
  [+] - Total RAM     : ${formatp(os.totalmem())}
  [+] - Total DISK    : ${tot.totalGb} GB
  [+] - Total CPU     : ${os.cpus().length} Core`));

  console.log(chalk.white(`\n────────────────────────\n`));
}
});

sock.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    const msg = chatUpdate.messages[0];
    if (!msg.message) return;

    const m = await ConfigBaileys(sock, msg);

    const isOwner =
      (Array.isArray(global.owner2)
        ? global.owner2.map(n => n + "@s.whatsapp.net").includes(m.sender)
        : m.sender === global.owner2 + "@s.whatsapp.net") ||
      m.key.fromMe;

    const settingsPath = path.join(__dirname, "./data/setbot.json");
    const set = JSON.parse(fs.readFileSync(settingsPath));
    if (m.isBaileys) return;
    if (!set.botActive && !isOwner) return;
   
    caseHandler(sock, m, chatUpdate);
  } catch (err) {
    console.log("Error on message:", err);
  }
});
    
    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };
    
sock.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
  try {
    const quoted = message.msg ? message.msg : message;
    const mime = (message.msg || message).mimetype || "";
    const messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];

    const Randoms = Date.now();
    const fil = Randoms;

    // pastikan folder ./data/trash ada
    if (!fs.existsSync("./data/trash")) {
      fs.mkdirSync("./data/trash", { recursive: true });
    }

    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const type = (await fileTypeFromBuffer(buffer)) || { ext: "bin", mime: "application/octet-stream" };
    const trueFileName = attachExtension
      ? `./data/trash/${fil}.${type.ext}`
      : filename || `./data/trash/${fil}.${type.ext}`;

    fs.writeFileSync(trueFileName, buffer);

    return trueFileName;
  } catch (err) {
    console.error("Error saat download media:", err);
    return null;
  }
};

   sock.downloadM = async (m, type, filename = '') => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
        }
        if (filename) await fs.promises.writeFile(filename, buffer)
        return filename && fs.existsSync(filename) ? filename : buffer
   }
   
   
   sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
    } else {
        buffer = await imageToWebp(buff);
    }

    await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };

    sock.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
    } else {
        buffer = await videoToWebp(buff);
    }

    await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };
    
    sock.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)

        let type = await fileTypeFromBuffer(data) || {
          mime: "application/octet-stream",
          ext: "bin"
        };
        
        filename = path.join(__filename, './data/trash/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename,
        data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    sock.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await sock.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;
  
  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await sock.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await sock.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}

    sock.sendContact = async (jid, kon = [], name, desk = "Developer Bot", quoted = '', opts = {}) => {
    const list = kon.map(i => ({
      displayName: typeof name !== 'undefined' ? name : 'Unknown',
      vcard:
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        `N:;${name || 'Unknown'};;;\n` +
        `FN:${name || 'Unknown'}\n` +
        'ORG:Unknown\n' +
        'TITLE:\n' +
        `item1.TEL;waid=${i}:${i}\n` +
        'item1.X-ABLabel:Ponsel\n' +
        `X-WA-BIZ-DESCRIPTION:${desk}\n` +
        `X-WA-BIZ-NAME:${name || 'Unknown'}\n` +
        'END:VCARD'
    }));

    await sock.sendMessage(
      jid,
      { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts },
      { quoted }
    );
   }
 }

startBot();

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});
