import { App } from "./app";
import { Database } from "./config/database";
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
import { RoleModel } from "./modules/role/role.model";
import { UserModel } from "./modules/user/user.model";
import { hashPassword } from "./modules/user/user.utils";
import { ServiceModel } from "./modules/service/service.model";
import { PartnerModel } from "./modules/partner/partner.model";
import { LeadModel } from "./modules/lead/lead.model";

async function seedDefaultAdmin(): Promise<void> {
  try {
    let adminRole = await RoleModel.findOne({ name: "ADMIN" });
    if (!adminRole) {
      adminRole = await RoleModel.create({
        name: "ADMIN",
        description: "Administrator role",
        permissions: ["ALL"],
      });
      console.log("Seeded default ADMIN role");
    }

    const adminEmail = "amit.bansal@aa.com";
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = hashPassword("admin123");
      await UserModel.create({
        email: adminEmail,
        phone: "+91 99999 99999",
        firstName: "Amit",
        lastName: "Bansal",
        password: hashedPassword,
        roleId: adminRole._id,
        status: "ACTIVE",
        externalAuthId: adminEmail,
      });
      console.log("Seeded default admin user: amit.bansal@aa.com / admin123");
    }
  } catch (err) {
    console.error("Failed to seed default admin:", err);
  }
}

async function seedDefaultData(): Promise<void> {
  try {
    const serviceCount = await ServiceModel.countDocuments();
    if (serviceCount === 0) {
      await ServiceModel.create([
        {
          code: "income-tax",
          name: "Income Tax Return Filing",
          category: "Income Tax",
          description: "End-to-end preparation and e-filing of individual/business income tax returns.",
          publicVisibility: true,
          clientAvailability: true,
          partnerAvailability: true,
          status: "ACTIVE",
          sortOrder: 1,
          slaDays: 5,
          documentRequirements: [
            { documentType: "PAN", label: "PAN Card", required: true },
            { documentType: "BANK_STATEMENT", label: "Bank Statements", required: true },
          ],
          workflow: [
            { stageCode: "SUBMITTED", name: "Submitted", sortOrder: 1, tasks: [] },
            { stageCode: "IN_PROGRESS", name: "In Progress", sortOrder: 2, tasks: [] },
            { stageCode: "CLOSED", name: "Closed", sortOrder: 3, tasks: [] },
          ],
        },
        {
          code: "gst-compliance",
          name: "GST Registration & Compliance",
          category: "GST",
          description: "New GST registration and ongoing monthly/quarterly return compliance.",
          publicVisibility: true,
          clientAvailability: true,
          partnerAvailability: true,
          status: "ACTIVE",
          sortOrder: 2,
          slaDays: 7,
          documentRequirements: [
            { documentType: "PAN", label: "PAN Card", required: true },
            { documentType: "ADDRESS_PROOF", label: "Address Proof", required: true },
          ],
          workflow: [
            { stageCode: "SUBMITTED", name: "Submitted", sortOrder: 1, tasks: [] },
            { stageCode: "CLOSED", name: "Closed", sortOrder: 2, tasks: [] },
          ],
        }
      ]);
      console.log("Seeded default services");
    }

    const partnerCount = await PartnerModel.countDocuments();
    if (partnerCount === 0) {
      await PartnerModel.create({
        partnerCode: "PTR-101",
        legalName: "Zenith Advisors",
        contact: {
          email: "kunal@zenithadvisors.example.com",
          phone: "+91 98200 10101",
        },
        status: "ACTIVE",
        pan: "AAZPS1234C",
        gstin: "27AAZPS1234C1Z8",
        bankAccountName: "Zenith Advisors LLP",
        bankAccountNumber: "123456789012",
        bankIfsc: "HDFC0000123",
        revenueSharePct: 15,
        tdsPct: 10,
      });
      console.log("Seeded default partner: Zenith Advisors");
    }

    const leadCount = await LeadModel.countDocuments();
    if (leadCount === 0) {
      await LeadModel.create({
        name: "Sanjay Goel",
        email: "sanjay@example.com",
        phone: "+91 99999 88888",
        source: "WEBSITE",
        status: "NEW",
        serviceName: "GST Registration & Compliance",
      });
      console.log("Seeded default lead: Sanjay Goel");
    }
  } catch (err) {
    console.error("Failed to seed default data:", err);
  }
}

async function bootstrap(): Promise<void> {
  const roleRepository = new RoleRepository();
  const roleService = new RoleService(roleRepository);
  const roleController = new RoleController(roleService);
  const roleRoute = new RoleRoute(roleController);

  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const userRoute = new UserRoute(userController);

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
  await seedDefaultAdmin();
  await seedDefaultData();

  app.listen();
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
