import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { ClientRepository } from "./client.repository";
import { IClient, IClientWithId } from "./client.types";

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  public async getClients(): Promise<IClientWithId[]> {
    return this.clientRepository.findAll();
  }

  public async getClientById(id: string): Promise<IClientWithId> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  public async getClientByCode(code: string): Promise<IClientWithId> {
    const client = await this.clientRepository.findByClientCode(code);
    if (!client) {
      throw new NotFoundException(`Client with code ${code} not found`);
    }
    return client;
  }

  public async createClient(data: IClient): Promise<IClientWithId> {
    if (!data.userId || !data.clientCode || !data.legalName || !data.contact || !data.acquisitionSource) {
      throw new BadRequestException("userId, clientCode, acquisitionSource, legalName, and contact details are required");
    }
    if (data.acquisitionSource === "PARTNER" && !data.partnerId) {
      throw new BadRequestException("partnerId is required when acquisitionSource is PARTNER");
    }
    const existing = await this.clientRepository.findByClientCode(data.clientCode);
    if (existing) {
      throw new BadRequestException(`Client with code ${data.clientCode} already exists`);
    }
    return this.clientRepository.create(data);
  }

  public async updateClient(id: string, data: Partial<IClient>): Promise<IClientWithId> {
    const updated = await this.clientRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return updated;
  }

  public async deleteClient(id: string): Promise<void> {
    const deleted = await this.clientRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }
}
