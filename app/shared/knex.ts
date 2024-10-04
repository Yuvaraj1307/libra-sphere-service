import knex, { Knex } from "knex";
import config from "../../config/db.json";

const db = knex(config);
(async (): Promise<Knex> => {
    try {
        await db.raw("SELECT 1+1;");
        console.log("DB connected Successfully")
        return db;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();

export default db;