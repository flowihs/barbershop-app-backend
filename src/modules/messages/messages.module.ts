import { Module } from "@nestjs/common";

// import { MessagesGateway } from "./messages.gateway";
import { MessagesService } from "./messages.service";

@Module({
	providers: [MessagesService]

	// MessagesGateway,
})
export class MessagesModule {}
