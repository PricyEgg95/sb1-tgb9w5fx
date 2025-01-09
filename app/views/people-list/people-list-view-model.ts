import { Observable } from '@nativescript/core';
import { Person } from '../../models/person';

export class PeopleListViewModel extends Observable {
    private _people: Person[] = [];

    constructor() {
        super();
        
        // Add sample data
        this._people = [
            new Person('John', 'Doe', new Date(1980, 0, 1)),
            new Person('Jane', 'Doe', new Date(1982, 5, 15))
        ];
        
        this.notifyPropertyChange('people', this._people);
    }

    get people(): Person[] {
        return this._people;
    }

    addPerson(person: Person) {
        this._people.push(person);
        this.notifyPropertyChange('people', this._people);
    }
}