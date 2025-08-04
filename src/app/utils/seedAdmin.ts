import config from "../config";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      email: config.ADMIN.SUPER_ADMIN_EMAIL,
      role: "ADMIN",
    });
    if (isAdminExists) {
      console.log("Super Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(
      config.ADMIN.SUPER_ADMIN_PASSWORD,
      Number(config.BCRYPT_SALT_ROUNDS)
    );

    const payload: IUser = {
      name: "Admin",
      email: config.ADMIN.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      phone: "+8801234567891",
      role: Role.ADMIN,
      address: "23/2 Banani Road-2, Dhaka-1213",
    };
    await User.create(payload);
    console.log("Super Admin created successfully");
  } catch (error) {
    console.log(error);
  }
};
