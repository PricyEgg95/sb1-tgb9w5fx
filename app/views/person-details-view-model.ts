import { Observable } from '@nativescript/core';
import { Person } from '../models/person';
import { DatabaseService } from '../services/database.service';
import { Frame } from '@nativescript/core';

export class PersonDetailsViewModel extends Observable {
    person: Person;
    relations: any[] = [];
    
    constructor(private database: DatabaseService, personId: string) {
        super();
        this.person = database.getPerson(personId);
        this.loadRelations();
    }
    
    get birthDateFormatted(): string {
        return this.person.birthDate.toLocaleDateString();
    }
    
    get deathDateFormatted(): string {
        return this.person.deathDate?.toLocaleDateString() || '';
    }
    
    private loadRelations() {
        const relations = this.database.getRelations(this.person.id);
        this.relations = relations.map(relation => {
            const otherPerson = this.database.getPerson(
                relation.person1Id === this.person.id ? relation.person2Id : relation.person1Id
            );
            return {
                relationType: relation.type,
                personName: `${otherPerson.firstName} ${otherPerson.lastName}`
            };
        });
        this.notifyPropertyChange('relations', this.relations);
    }
    
    onEditTap() {
        Frame.topmost().navigate({
            moduleName: 'views/person-form-page',
            context: { person: this.person }
        });
    }
    
    onAddRelation() {
        // TODO: Implement relation selection dialog
        console.log('Add relation tapped');
    }
}