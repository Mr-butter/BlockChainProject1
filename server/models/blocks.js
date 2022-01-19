const Sequelize = require("sequelize");

/* 사용자 정보 DB */
module.exports = class BlockChainDB extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        /* 시퀄라이즈 에서는 id 자동 생성됨.
                    id : {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    },
                */
        index: {
          type: Sequelize.INTEGER(),
          allowNull: false,
        },
        version: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        previousHash: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        timestamp: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        merkleRoot: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        difficulty: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        nonce: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        body: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Block",
        tableName: "blocks",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
};
