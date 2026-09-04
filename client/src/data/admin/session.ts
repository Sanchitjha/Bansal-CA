// Mock data for the Admin Panel — Admin session/profile.

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

export const mockAdminProfile: AdminProfile = {
  name: "Amit Bansal",
  email: "amit.bansal@aa.com",
  role: "Administrator",
};
