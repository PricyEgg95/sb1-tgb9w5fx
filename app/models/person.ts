export class Person {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    deathDate?: Date;
    photoUrl?: string;

    constructor(firstName: string, lastName: string, birthDate: Date) {
        this.id = crypto.randomUUID();
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }
}