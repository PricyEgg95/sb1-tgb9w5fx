import { EventData, Page } from '@nativescript/core';
import { PeopleListViewModel } from './people-list-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new PeopleListViewModel();
}

export function onItemTap(args: any) {
    const viewModel = args.object.bindingContext;
    const person = viewModel.people[args.index];
    // TODO: Navigate to person details
    console.log(`Tapped on ${person.firstName} ${person.lastName}`);
}

export function onAddTap() {
    // TODO: Navigate to add person form
    console.log('Add person tapped');
}