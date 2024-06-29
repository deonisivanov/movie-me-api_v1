import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, Entity, InsertResult, FindOneOptions, UpdateResult } from 'typeorm';

@Injectable()
export class BaseService<Entity> {
  constructor(
    @InjectRepository(Entity)
    private readonly repository: Repository<Entity>
  ) {}

  public async findOne(options: FindOneOptions<Entity>): Promise<Entity | undefined> {
    return await this.repository.findOne(options);
  }

  public async findOneById(id: number | string): Promise<Entity | undefined> {
    return await this.repository.findOne({ where: { id } as any });
  }

  public async findOneByLogin(login: string): Promise<Entity | undefined> {
    return await this.repository.findOne({ where: { login } as any });
  }

  public async create(body: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.create(body);
  }

  public async insert(body: DeepPartial<Entity>): Promise<InsertResult> {
    return await this.repository.insert(body as any);
  }

  public async save(body: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.save(body);
  }

  public async update(id: number | string, body: DeepPartial<Entity>): Promise<UpdateResult> {
    return await this.repository.update(id, body as any);
  }
}
