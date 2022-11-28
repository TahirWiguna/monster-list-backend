module.exports = (sequelize, Sequelize) => {
  const Monster = sequelize.define("monster", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    hp: {
      type: Sequelize.INTEGER,
    },
    attack: {
      type: Sequelize.INTEGER,
    },
    image: {
      type: Sequelize.STRING,
    },
  })

  return Monster
}
