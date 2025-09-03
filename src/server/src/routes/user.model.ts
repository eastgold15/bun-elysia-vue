import { t } from "elysia";
import { DbType } from "../db/typebox.type";

export const UserRouteModel = {

  registerDto: t.Omit(DbType.typebox.insert.userSchema, ['id', 'createdAt', 'updatedAt']),
  loginDto: t.Pick(DbType.typebox.insert.userSchema, ['username', 'password']),
}