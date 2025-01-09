import { Observable } from '@nativescript/core';
import { Person } from '../models/person';
import { Relation, RelationType } from '../models/relation';

export class DatabaseService extends Observable {
    private people: Map<string, Person> = new Map();
    private relations: Relation[] = [];

    addPerson(person: Person): void {
        this.people.set(person.id, person);
        this.notifyPropertyChange('people', this.people);
    }

    getPerson(id: string): Person | undefined {
        return this.people.get(id);
    }

    getAllPeople(): Person[] {
        return Array.from(this.people.values());
    }

    addRelation(person1Id: string, person2Id: string, type: RelationType): void {
        const relation: Relation = {
            id: crypto.randomUUID(),
            person1Id,
            person2Id,
            type
        };
        this.relations.push(relation);
        this.notifyPropertyChange('relations', this.relations);
    }

    getRelations(personId: string): Relation[] {
        return this.relations.filter(r => 
            r.person1Id === personId || r.person2Id === personId
        );
    }
}