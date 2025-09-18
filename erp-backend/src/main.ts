import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	// Apply global security middleware
	app.use(helmet());
	
	// Enable CORS for frontend
	app.enableCors({
		origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
