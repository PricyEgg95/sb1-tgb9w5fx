export enum RelationType {
    PARENT = 'PARENT',
    CHILD = 'CHILD',
    SPOUSE = 'SPOUSE'
}

export interface Relation {
    id: string;
    person1Id: string;
    person2Id: string;
    type: RelationType;
}