const { Sequelize, DataTypes, Model } = require('sequelize');

class Base extends Model{
    initConnection = () =>{
        return new Sequelize('replicant_schema', 'admin', 'anfield1892'
            , {
                host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
                dialect: 'mysql'
            });
    }
}