import { Controller } from "@nestjs/common";

import { ProvisionService } from "./provision.service";

@Controller("provision")
export class ProvisionController {
	constructor(private readonly provisionService: ProvisionService) {}
}
