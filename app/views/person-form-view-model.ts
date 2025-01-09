import { Observable } from '@nativescript/core';
import { Person } from '../models/person';
import { DatabaseService } from '../services/database.service';
import { Frame } from '@nativescript/core';

export class PersonFormViewModel extends Observable {
    isEditing: boolean = false;
    firstName: string = '';
    lastName: string = '';
    birthDate: Date = new Date();
    deathDate?: Date;
    photoUrl?: string;
    
    constructor(private database: DatabaseService, person?: Person) {
        super();
        
        if (person) {
            this.isEditing = true;
            this.firstName = person.firstName;
            this.lastName = person.lastName;
            this.birthDate = person.birthDate;
            this.deathDate = person.deathDate;
            this.photoUrl = person.photoUrl;
        }
    }
    
    onSave() {
        const person = new Person({
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            deathDate: this.deathDate,
            photoUrl: this.photoUrl
        });
        
        this.database.addPerson(person);
        Frame.topmost().goBack();
    }
    
    onCancel() {
        Frame.topmost().goBack();
    }
    
    async onSelectPhoto() {
        // TODO: Implement photo selection
        console.log('Select photo tapped');
    }
}