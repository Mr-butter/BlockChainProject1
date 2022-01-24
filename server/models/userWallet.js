const Sequelize = require("sequelize");

/* 사용자 정보 DB */
module.exports = class UserWallet extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                address: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                    unique: true, // unique: true - 고유하게
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                keystore: {
                    type: Sequelize.JSON,
                    allowNull: true,
                },
                mnemonic: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                },
                point: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "UserWallet",
                tableName: "userwallets",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {}
};
