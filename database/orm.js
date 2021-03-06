const fs = require('fs');

module.exports = function() {
    console.log('sequelize', process.env.DB_HOSTNAME, process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD);
    const Sequelize = require('sequelize');
    const seqClient = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        // dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    // test connection
    let testConnection = seqClient
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            throw new Error('listId does not exist');
        });

    let schemas = {
        // Entity: sequelize.define('entity',require('./schemas/entity'))
    };

    let items = fs.readdirSync(__dirname + '/schemas');

    items.map(fileName => {
        console.log('handle', fileName);
        let entityName = fileName.replace(/^(.*)\.js$/, '$1');
        schemas[entityName] = require(`./schemas/${entityName}`)(seqClient, Sequelize.DataTypes)
    });

    let syncs = [testConnection];

    // si pas de table migations => syn
    let hasMigrationTable = false;
    if(!hasMigrationTable) {
        for(let key in schemas) {
            syncs.push(schemas[key].sync());
        }
    }

    return Promise.all(syncs).then(() => schemas);
};
