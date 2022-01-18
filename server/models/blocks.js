const Sequelize = require("sequelize");

/* 사용자 정보 DB */
module.exports = class BlcokChainDB extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        /* 시퀄라이즈 에서는 id 자동 생성됨.
                    id : {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    },                */
                    {
        COLINK :{type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },

        BlockChain: {
          type: Sequelize.JSON,
          allowNull: false,
          defaultValue: `{"header":{"version":"0.0.1","index":0,"previousHash":"0000000000000000000000000000000000000000000000000000000000000000","timestamp":1231006505,"merkleRoot":"A6D72BAA3DB900B03E70DF880E503E9164013B4D9A470853EDC115776323A098","difficulty":0,"nonce":0},"body":["The Times 03/Jan/2009 Chancellor 
          on brink of second bailout for banks"]}`,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "COLINK1",
        tableName: "COLINK1",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
};
