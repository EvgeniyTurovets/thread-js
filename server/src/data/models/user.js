export default (orm, DataTypes) => {
  const User = orm.define('user', {
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isUnique(value) {
          return User.findOne({
            where: { username: value },
            attributes: ['id']
          })
            .then(user => {
              if (user && user.id !== this.id) {
                throw new Error('Username already exist.');
              }
            });
        }
      },
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    status: {
      type: DataTypes.STRING
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return User;
};
