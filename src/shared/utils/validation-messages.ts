export const validationMessages = {
	required: (field: string) => `Поле ${field} является обязательным`,
	string: (field: string) => `Поле ${field} должно быть строкой`,
	number: (field: string) => `Поле ${field} должно быть числом`,
	int: (field: string) => `Поле ${field} должно быть целым числом`,
	array: (field: string) => `Поле ${field} должно быть массивом`,
	date: (field: string) => `Поле ${field} должно быть валидной датой`
};
