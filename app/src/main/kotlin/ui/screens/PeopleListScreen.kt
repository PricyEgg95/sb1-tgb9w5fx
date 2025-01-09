@Composable
fun PeopleListScreen(
    onPersonClick: (Person) -> Unit,
    onAddClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: PeopleViewModel = viewModel()
    val people by viewModel.people.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = onAddClick) {
                Icon(Icons.Default.Add, "Add Person")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = modifier.padding(padding)
        ) {
            items(people) { person ->
                PersonCard(
                    person = person,
                    onClick = { onPersonClick(person) }
                )
            }
        }
    }
}