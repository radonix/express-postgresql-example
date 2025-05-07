import configdb from "../config/db.config.js";
import {Sequelize} from "sequelize";
import User from "./User.js";

const sequelize = new Sequelize(
    configdb.database,
    configdb.user,
    configdb.password,
    {
      host: configdb.host,
      dialect: configdb.dialect,
      port: configdb.port,
      pool: {
        max: configdb.pool.max,
        min: configdb.pool.min,
        acquire: configdb.pool.acquire,
        idle: configdb.pool.idle,
        evict: configdb.pool.evict,
      },
    }
);

const db = {};  
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize,Sequelize);

export default db;