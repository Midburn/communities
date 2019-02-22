const sequelizeErd = require ('sequelize-erd');
const db = require ('../server/services/database');
const fs = require ('fs');
const path = require ('path');

async function erd () {
  try {
    await db.init ();
    const svg = await sequelizeErd ({source: db.sequelize});
    fs.writeFile (path.join (__dirname, './erd.svg'), svg, err => {
      if (err) {
        console.warn (err);
        process.exit (1);
      }
      console.log ();
      process.exit (0);
    });
  } catch (e) {
    console.warn (e);
    process.exit (1);
  }
}

erd ();
