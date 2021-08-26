export default function NameByYearModel({ sequelize, DataTypes }) {
    return sequelize.define('NameByYear', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        occurrences: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        maleOccurrences: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        femaleOccurrences: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        pctWithName: {
            type: DataTypes.DECIMAL(20, 19),
            allowNull: false,
            defaultValue: 0,
        },
        malePctWithName: {
            type: DataTypes.DECIMAL(20, 19),
            allowNull: false,
            defaultValue: 0,
        },
        femalePctWithName: {
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
        tableName: 'bn_names_by_year',
        indexes: [
            {
                unique: true,
                fields: [
                    'nameid',
                    'year',
                ],
            },
            {
                name: 'bn_names_by_year_all',
                fields: [
                    'nameid',
                    'year',
                    'unisexScore',
                    'occurrences',
                    'maleOccurrences',
                    'femaleOccurrences',
                ],
            },
        ],
    });
}
