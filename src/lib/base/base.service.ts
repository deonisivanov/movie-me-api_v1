import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, DeepPartial, Entity, InsertResult } from 'typeorm';

@Injectable()
export class BaseService<Entity> {
  constructor(
    @InjectRepository(Entity)
    private readonly repository: Repository<Entity>
  ) {}

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
