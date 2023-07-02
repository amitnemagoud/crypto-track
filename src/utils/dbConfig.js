

import pkg from "pg"
const {Pool} = pkg


export const db = new Pool({
    database : "postgres",
    user : "postgres",
    password : "password",
    host : "localhost",
    port : 5432,
})