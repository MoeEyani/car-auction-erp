import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { TestController } from "./test.controller";
import { BranchesModule } from "./branches/branches.module";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		EventEmitterModule.forRoot(),
		ThrottlerModule.forRoot([{
			ttl: 60000, // 1 minute in milliseconds
			limit: 10,  // 10 requests per minute
		}]),
		PrismaModule,
		BranchesModule,
		AuthModule,
		RolesModule,
		UsersModule,
	],
	controllers: [AppController, TestController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
