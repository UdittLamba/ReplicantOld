const {Sequelize, DataTypes, Model} = require('sequelize');



export default class Subreddit extends Model {
    // const sequelize = new sequelize(production);
    sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
        , {
            host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
            dialect: 'mysql'
        });
    static init(sequelize) {
        return super.init({
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey:true,
                    autoIncrement:true,
                    allowNull: false,
                    unique: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isApproved: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                }
            },
            {
                sequelize: sequelize,
                modelName:'Subreddit'
            }
        );

    }
}


// module.exports = Subreddit;