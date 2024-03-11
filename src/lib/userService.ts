import User from "@/models/user";
//@ts-ignore
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";

export async function signInWithCredentials(email: string, password: string) {
  await connectMongoDB();
  const user = await User.findOne({ email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });
    return newUser;
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return null;
  }

  return user;
}
