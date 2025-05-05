import dotenv from "dotenv";
dotenv.config(); // Primera línea de código

import os from "os";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import pkg from "debug";

const { default: createDebug, enable } = pkg;
if (process.env.DEBUG) {
  enable(process.env.DEBUG);
}

const debug = createDebug("CHATGPT");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ruta = path.join(__dirname, "index.js");

debug(chalk.bold.red("Hackeando tu sistema operativo..."));

setTimeout(() => {
  console.clear();
  showInfo();
}, 2000);
const comprobarPermisosRuta = (ruta) =>
  new Promise((resolve, reject) =>
    fs.access(ruta, (error) => {
      if (error) {
        debug(
          "No se ha podido comprobar los permisos de dicha ruta. ",
          error.message
        );
        reject(false);
      }
      resolve(true);
    })
  );

const getInfoRuta = (ruta) =>
  new Promise((resolve, reject) =>
    fs.stat(path.join(__dirname, ruta), (error, datos) => {
      if (error) {
        debug(
          "No se ha podido obtener información sobre la ruta. ",
          error.message
        );
        reject(null);
      }
      resolve(datos);
    })
  );
const showInfoRutas = (rutas) => {
  rutas.forEach(async (ruta) => {
    const tienesPermisos = await comprobarPermisosRuta(ruta);

    if (!tienesPermisos) return;

    const objetoInfoRuta = await getInfoRuta(ruta);
    if (!objetoInfoRuta) return;
    // Es NORMAL que si es un directorio, el size es 0
    debug(
      `- ${__dirname}\\${ruta}\t${objetoInfoRuta.size}\t${
        objetoInfoRuta.isDirectory() ? "Directorio" : "Archivo"
      }`
    );
  });
};
const showInfo = () => {
  if (process.platform === "linux") {
    debug(chalk.bold.green("Tú molas"));
  } else if (process.platform === "win32") {
    debug(chalk.bold.yellow("Tú no molas mucho"));
  } else if (process.platform === "darwin") {
    debug(
      chalk.bold.red("Tú no molas nada. ") +
        chalk.bold.green(
          "Bueno, excepto si eres Geraldine o Pol. En ese caso molas. Pero por ser tú, no por usar Mac"
        )
    );
  }
  debug(chalk.bold.yellow(`Cuidado, te quedan ${os.freemem} Mb de RAM libre`));
  debug(chalk.bold.blue(`La versión de tu sistema operativo es ${os.version}`));
  debug(
    chalk.bold.blue(
      `Tu usuario del sistema operativo es ${
        os.userInfo().username
      } y tu carpeta es ${os.userInfo().homedir}`
    )
  );
  fs.readdir(__dirname, (error, rutas) => {
    // Leer el disco duro es asincrono. Comprobamos primero si ha habido errores y si los ha habido retornamos.
    if (error) {
      return debug(
        "No se han podido leer archivos y carpetas que hay en mi carpeta actual",
        error.message
      );
    }
    debug("\nÉstos son los archivos y carpetas de tu carpeta de usuario:\n");

    showInfoRutas(rutas);
  });
};
