export default function NameModel({ sequelize, DataTypes }) {
    return sequelize.define('Name', {
        nameid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        allTimeOccurrences: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        allTimeMaleOccurrences: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        allTimeFemaleOccurrences: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        allTimePctWithName: {
            type: DataTypes.DECIMAL(20, 19),
            allowNull: false,
            defaultValue: 0,
        },
        allTimeMalePctWithName: {
            type: DataTypes.DECIMAL(20, 19),
            allowNull: false,
            defaultValue: 0,
        },
        allTimeFemalePctWithName: {
            type: DataTypes.DECIMAL(20, 19),
            allowNull: false,
            defaultValue: 0,
        },
        unisexScore: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        tableName: 'bn_names',
        indexes: [
            {
                unique: true,
                fields: [
                    'name',
                ],
            },
        ],
    });
}
