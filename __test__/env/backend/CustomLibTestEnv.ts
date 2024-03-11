import { JestEnvironmentConfig, EnvironmentContext } from "@jest/environment";
import NodeEvironment from "jest-environment-node";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";
import {connectMongoDB} from "@/lib/mongodb";
import User from "@/models/user";

class CustomJestEnv extends NodeEvironment {
  testPath: string;
  docblockPragmas: Record<string, string | string[]>;
  mongod: MongoMemoryServer | undefined;
  mongoose: Mongoose | undefined;
  seed: any;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    try {
      await super.setup();
      const mongod = new MongoMemoryServer();
      await mongod.start();

      this.mongod = mongod;
      const URI = await this.mongod.getUri();
      this.global.__MONGO_URI__ = `${URI}`;
    } catch (e: any) {
      console.error("Test Error -> ", e?.message || e);
    }
  }

  async teardown() {
    console.log('Tearing down');
    await super.teardown();
    await this.mongod?.stop();
    console.log('Done')
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(event: any, _state: any) {
    if (event.name === "test_start") {
    }
  }
}

export default CustomJestEnv;
