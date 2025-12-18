/*

   ~ Shota BASED
  > Jangan lupa baca README.md <

*/

import fs from "fs";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);

// ~~ setting pairing kode ~~
global.pairingKode = "HANZOFFC" //pairing kode

// ~~ setting bot ~~
global.owner = "6283143694217" //pemilik bot
global.owner2 = [
" ",
" ",
" "
] //buat fitur bot mode on atau off 

global.url = "https://shop.hanzxd.biz.id"
global.footer = `© xcde | hanzxd`

global.namaOwner = "—powered by hanzxd"
global.namaBot = "shota-base"

// ~~ setting saluran ~~
global.idChannel = "120363380343761245@newsletter"
global.namaChannel = "xsbot"

// ~~ setting foto ~~
global.foto = "https://img1.pixhost.to/images/10395/664274571_hanzxdoffc.jpg"

global.mess = {
 owner: "*[REJECT]* - ONLY OWNER",
 admin: "*[REJECT]* - ONLY ADMINS GROUPS",
 botAdmin: "*[REJECT]* - BOT HARUS ADMIN",
 group: "*[REJECT]* - ONLY IN THE GROUP",
 sewa: "*[REJECT]* - ONLY USER PREMIUM",
 vip: "*[REJECT]* - ONLY ONWER & PREMIUM USERS",
 ownadmin: "*[REJECT]* - ONLY OWNER & ADMINS"
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});
