
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Friends', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            foto: {
                type: Sequelize.TEXT,
            },
            nome: {
                type: Sequelize.STRING,
            },
            telefone: {
                type: Sequelize.STRING,
            },
            enrabado: {
                type: Sequelize.INTEGER,
            },
            pais: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Friends');
    },
};
