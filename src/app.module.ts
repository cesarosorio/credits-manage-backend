import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CreditsModule } from './credits/credits.module';
import { PaymentsModule } from './payments/payments.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '192.168.4.29',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password:
        process.env.DB_PASSWORD ||
        'fMxTa6QYWaPFbJD5qtHMsxO1XYPon6jjFn3pR1H39OXhrJUPIrf0Ya7ilB1bQDXN',
      database: process.env.DB_DATABASE || 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    CreditsModule,
    PaymentsModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
