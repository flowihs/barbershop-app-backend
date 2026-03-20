import type { TelegramUserDto as TelegramUserDtoType } from "@/src/modules/account/dto/telegram-user.dto";

export const mockTelegramUsers = {
	client: {
		id: 123456789,
		first_name: "Alice",
		username: "alice_client"
	} as TelegramUserDtoType,

	barber: {
		id: 987654321,
		first_name: "Bob",
		username: "bob_barber"
	} as TelegramUserDtoType,

	secondBarber: {
		id: 555555555,
		first_name: "Charles",
		username: "charles_barber"
	} as TelegramUserDtoType
};

interface TestFlow {
	step: number;
	description: string;
	endpoint: string;
	method: string;
	expectedStatus: number;
}

export const testFlowSequence: TestFlow[] = [
	{
		step: 1,
		description: "Client registers via Telegram",
		endpoint: "/account/me",
		method: "GET",
		expectedStatus: 200
	},
	{
		step: 2,
		description: "Barber registers via Telegram",
		endpoint: "/account/me",
		method: "GET",
		expectedStatus: 200
	},
	{
		step: 3,
		description: "Create Provision (Service)",
		endpoint: "/provisions/create",
		method: "POST",
		expectedStatus: 201
	},
	{
		step: 4,
		description: "Get all provisions",
		endpoint: "/provisions/all",
		method: "GET",
		expectedStatus: 200
	},
	{
		step: 5,
		description: "Client books a slot",
		endpoint: "/booking/:slotId",
		method: "PUT",
		expectedStatus: 200
	},
	{
		step: 6,
		description: "Client gets their bookings",
		endpoint: "/booking/:userId",
		method: "GET",
		expectedStatus: 200
	},
	{
		step: 7,
		description: "Client cancels booking",
		endpoint: "/booking/:bookingId",
		method: "DELETE",
		expectedStatus: 200
	}
];

export const expectedResponses = {
	account: {
		id: "number",
		firstName: "string",
		username: "string|null",
		description: "string|null",
		email: "string|null",
		createdAt: "Date?",
		updatedAt: "Date?"
	},

	provision: {
		id: "number",
		title: "string",
		description: "string",
		price: "number",
		image: "string",
		slots: "Slot[]",
		user: "User",
		category: "Category",
		createdAt: "Date",
		updatedAt: "Date"
	},

	slot: {
		id: "number",
		time: "Date",
		isBooking: "boolean",
		provision: "Provision",
		booking: "Booking|null",
		createdAt: "Date",
		updatedAt: "Date"
	},

	booking: {
		id: "number",
		slotId: "number",
		userId: "number",
		status: "CONFIRMED|CANCELLED|COMPLETED|NO_SHOW",
		totalPrice: "number|null",
		slot: "Slot",
		user: "User",
		cancelledAt: "Date|null",
		createdAt: "Date",
		updatedAt: "Date"
	}
};

export const testAssertions = {
	createAccount: {
		description: "Account should be created with Telegram ID as PK",
		assertions: [
			"response.id === user.id",
			"response.firstName === user.first_name",
			"response.username === user.username || null"
		]
	},

	createProvision: {
		description:
			"Provision should include created slots with correct times",
		assertions: [
			"response.userId === barber.id",
			"response.slots.length === times.length",
			"All slots have correct times",
			"All slots have isBooking === false"
		]
	},

	bookSlot: {
		description: "Booking should link correct user and slot",
		assertions: [
			"booking.userId === client.id",
			"booking.slotId === slot.id",
			"booking.status === CONFIRMED",
			"slot.isBooking === true",
			"booking.totalPrice === provision.price"
		]
	},

	cancelBooking: {
		description: "Cancellation should update status and free slot",
		assertions: [
			"booking.status === CANCELLED",
			"booking.cancelledAt is set",
			"slot.isBooking === false",
			"Only client or provider can cancel"
		]
	}
};

export const errorScenarios = [
	{
		name: "Book already booked slot",
		shouldThrow: "Слот уже забронирован",
		expectedStatus: 400
	},
	{
		name: "Cancel completed booking",
		shouldThrow: "Нельзя отменить выполненную услугу",
		expectedStatus: 400
	},
	{
		name: "Cancel already cancelled booking",
		shouldThrow: "Вы уже отказались от услуги",
		expectedStatus: 400
	},
	{
		name: "Unauthorised user tries to cancel",
		shouldThrow: "Вы не можете отменить эту бронь",
		expectedStatus: 400
	},
	{
		name: "Invalid Telegram signature",
		shouldThrow: "Invalid Telegram signature",
		expectedStatus: 401
	}
];
