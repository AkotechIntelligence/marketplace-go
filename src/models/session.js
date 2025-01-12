module.exports = (sequelize, DataTypes) => {
	const Session = sequelize.define("Session", {
		sid: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		expires: {
			type: DataTypes.DATE,
		},
		data: {
			type: DataTypes.TEXT,
		},
	},{
        sequelize,
        modelName: 'Session',
        tableName: 'Session'
    });

	return Session;
};
