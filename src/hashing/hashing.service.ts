import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  constructor(private readonly configService: ConfigService) {}

  hashing(password: string) {
    const saltRounds = +this.configService.get('HASH_SALT');
    return bcrypt.hash(password, saltRounds);
  }

  checkHash(data: string, encrypted: string) {
    return bcrypt.compare(data, encrypted);
  }
}
