import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, Entity, InsertResult, FindOneOptions } from 'typeorm';

@Injectable()
export class BaseService<Entity> {
  constructor(
    @InjectRepository(Entity)
    private readonly repository: Repository<Entity>
  ) {}

  public async findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    return await this.repository.findOne(options);
  }

  public async findOneById(id: number | string): Promise<Entity | null> {
    return await this.repository.findOne({ where: { id } as any });
  }

  public create(body: DeepPartial<Entity>): Entity {
    return this.repository.create(body);
  }

  public async insert(body: DeepPartial<Entity>): Promise<InsertResult> {
    return await this.repository.insert(body as any);
  }

  public async save(body: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.save(body);
  }
}
