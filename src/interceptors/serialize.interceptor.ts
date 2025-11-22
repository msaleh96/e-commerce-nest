import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';



export function Serialize<T>(dto: Type<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto:any){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    console.log('Before...');
    return next.handle().pipe(map((data:any) => {
      return plainToClass(this.dto, data, {
        excludeExtraneousValues:true,
      })
      console.log(`After...`)
    }));
  }
}
