import { ConnectionStates, Mongoose } from "mongoose";
import { signInWithCredentials } from "@/lib/userService";

export enum SeedStatus {
  initial = "initial",
  started = "started",
  completed = "completed",
}

const Users = [
  {
    email: "test@gmail.com",
    password: "123",
  },
];

export class Seed {
  client: Mongoose;
  private testData = new Map<string, any>();
  status = SeedStatus.initial;

  constructor(client: Mongoose) {
    this.client = client;
  }

  async seedData() {
    if (this.status === SeedStatus.initial) {
      this.status = SeedStatus.started;
      await Promise.all(
        Users.map((user) => signInWithCredentials(user.email, user.password)),
      );

      this.status = SeedStatus.completed;
    }
  }

  getTestData(key?: string) {
    return (
      (this.testData.get(key as any) as Record<string, any>) ||
      (this.testData as Map<string, any>)
    );
  }
}
