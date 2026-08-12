import { App } from "./app";
import { Database } from "./config/database";
import { UserController } from "./modules/user/user.controller";
import { UserRepository } from "./modules/user/user.repository";
import { UserRoute } from "./modules/user/user.route";
import { UserService } from "./modules/user/user.service";

async function bootstrap(): Promise<void> {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const userRoute = new UserRoute(userController);

  const app = new App([userRoute]);

  const database = new Database();
  await database.connect();

  app.listen();
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
