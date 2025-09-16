import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { TestController } from "./test.controller";
import { BranchesModule } from "./branches/branches.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		BranchesModule,
	],
	controllers: [AppController, TestController],
	providers: [AppService],
})
export class AppModule {}
