import { App } from "./app";
import { Authenticate } from "./common/middlewares/auth.middleware";
import { Database } from "./config/database";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthRoute } from "./modules/auth/auth.route";
import { AuthService } from "./modules/auth/auth.service";
import { UserController } from "./modules/user/user.controller";
import { UserRepository } from "./modules/user/user.repository";
import { UserRoute } from "./modules/user/user.route";
import { UserService } from "./modules/user/user.service";
import { RoleRepository } from "./modules/role/role.repository";
import { RoleService } from "./modules/role/role.service";
import { RoleController } from "./modules/role/role.controller";
import { RoleRoute } from "./modules/role/role.route";
import { PartnerRepository } from "./modules/partner/partner.repository";
import { PartnerService } from "./modules/partner/partner.service";
import { PartnerController } from "./modules/partner/partner.controller";
import { PartnerRoute } from "./modules/partner/partner.route";
import { ClientRepository } from "./modules/client/client.repository";
import { ClientService } from "./modules/client/client.service";
import { ClientController } from "./modules/client/client.controller";
import { ClientRoute } from "./modules/client/client.route";
import { ServiceRepository } from "./modules/service/service.repository";
import { ServiceService } from "./modules/service/service.service";
import { ServiceController } from "./modules/service/service.controller";
import { ServiceRoute } from "./modules/service/service.route";
import { LeadRepository } from "./modules/lead/lead.repository";
import { LeadService } from "./modules/lead/lead.service";
import { LeadController } from "./modules/lead/lead.controller";
import { LeadRoute } from "./modules/lead/lead.route";
import { CaseRepository } from "./modules/case/case.repository";
import { CaseService } from "./modules/case/case.service";
import { CaseController } from "./modules/case/case.controller";
import { CaseRoute } from "./modules/case/case.route";
import { FinanceRepository } from "./modules/finance/finance.repository";
import { FinanceService } from "./modules/finance/finance.service";
import { FinanceController } from "./modules/finance/finance.controller";
import { FinanceRoute } from "./modules/finance/finance.route";

async function bootstrap(): Promise<void> {
  const roleRepository = new RoleRepository();
  const roleService = new RoleService(roleRepository);
  const roleController = new RoleController(roleService);
  const roleRoute = new RoleRoute(roleController);

  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  const authService = new AuthService(userRepository, roleRepository);
  const authController = new AuthController(authService);
  const authenticate = new Authenticate(authService);
  const authRoute = new AuthRoute(authController, authenticate);

  const userRoute = new UserRoute(userController, authenticate);

  const partnerRepository = new PartnerRepository();
  const partnerService = new PartnerService(partnerRepository);
  const partnerController = new PartnerController(partnerService);
  const partnerRoute = new PartnerRoute(partnerController);

  const clientRepository = new ClientRepository();
  const clientService = new ClientService(clientRepository);
  const clientController = new ClientController(clientService);
  const clientRoute = new ClientRoute(clientController);

  const serviceRepository = new ServiceRepository();
  const serviceService = new ServiceService(serviceRepository);
  const serviceController = new ServiceController(serviceService);
  const serviceRoute = new ServiceRoute(serviceController);

  const leadRepository = new LeadRepository();
  const leadService = new LeadService(leadRepository);
  const leadController = new LeadController(leadService);
  const leadRoute = new LeadRoute(leadController);

  const caseRepository = new CaseRepository();
  const caseService = new CaseService(caseRepository);
  const caseController = new CaseController(caseService);
  const caseRoute = new CaseRoute(caseController);

  const financeRepository = new FinanceRepository();
  const financeService = new FinanceService(financeRepository);
  const financeController = new FinanceController(financeService);
  const financeRoute = new FinanceRoute(financeController);

  const app = new App([
    authRoute,
    userRoute,
    roleRoute,
    partnerRoute,
    clientRoute,
    serviceRoute,
    leadRoute,
    caseRoute,
    financeRoute,
  ]);

  const database = new Database();
  await database.connect();

  app.listen();
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
