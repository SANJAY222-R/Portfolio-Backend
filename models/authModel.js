import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../config/db.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

User.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

User.createUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};

User.findUserByResetToken = async (token) => {
  return await User.findOne({
    where: {
      reset_token: token,
      reset_token_expires: {
        [Op.gt]: Date.now(),
      },
    },
  });
};

User.setResetToken = async (email, token, expires) => {
  const [affectedRows, [updatedUser]] = await User.update(
    { reset_token: token, reset_token_expires: expires },
    {
      where: { email },
      returning: true,
    }
  );
  return updatedUser;
};

User.updateUserPassword = async (id, password) => {
  const [affectedRows, [updatedUser]] = await User.update(
    {
      password,
      reset_token: null,
      reset_token_expires: null,
    },
    {
      where: { id },
      returning: true,
    }
  );
  return updatedUser;
};

export default User;
