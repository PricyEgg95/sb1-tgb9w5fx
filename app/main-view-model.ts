import { Observable } from '@nativescript/core';
import { Person } from './models/person';
import { DatabaseService } from './services/database.service';
import { Frame } from '@nativescript/core';

export class MainViewModel extends Observable {
    private database: DatabaseService;
    
    constructor() {
        super();
        
        this.database = new DatabaseService();
        
        // Add some sample data
        const john = new Person({
            firstName: 'John',
            lastName: 'Doe',
            birthDate: new Date(1980, 0, 1)
        });
        
        const jane = new Person({
            firstName: 'Jane',
            lastName: 'Doe',
            birthDate: new Date(1982, 5, 15)
        });
        
        this.database.addPerson(john);
        this.database.addPerson(jane);
        
        this.notifyPropertyChange('people', this.people);
    }
    
    get people(): Person[] {
        return this.database.getAllPeople();
    }
    
    onPersonTap(args: any) {
        const person = this.people[args.index];
        Frame.topmost().navigate({
            moduleName: 'views/person-details-page',
            context: { personId: person.id }
        });
    }
    
    onAddPerson() {
        Frame.topmost().navigate({
            moduleName: 'views/person-form-page'
        });
    }
}