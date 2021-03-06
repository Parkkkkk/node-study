module.exports = ( sequelize, DataTypes) => {
    return sequelize.define ('comment', {
        comment : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
        created_at : {
            type : DataTypes.DATE,
            allowNull : true,
            defaultValues : sequelize.literal('now()'),
        },
    },{
        timestamps : false,
    });
};