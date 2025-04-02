import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async findAll() {
    return this.tenantRepository.find();
  }

  async findOne(id: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async findBySubdomain(subdomain: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
    }

    return tenant;
  }

  async create(createTenantDto: CreateTenantDto) {
    // Check if subdomain already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { subdomain: createTenantDto.subdomain },
    });

    if (existingTenant) {
      throw new ConflictException('Subdomain already in use');
    }

    const newTenant = this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(newTenant);
  }

  async update(id: string, updateTenantDto: Partial<CreateTenantDto>) {
    await this.findOne(id); // Verify if tenant exists
    
    await this.tenantRepository.update(id, updateTenantDto);
    
    return this.findOne(id);
  }

  async remove(id: string) {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
    return { deleted: true };
  }
}
