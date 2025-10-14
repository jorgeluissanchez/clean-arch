import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskHttpModule } from './presentation/module/task.module';
import { CategoryHttpModule } from './presentation/module/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TaskHttpModule,
    CategoryHttpModule,
  ],
})
export class AppModule {}
