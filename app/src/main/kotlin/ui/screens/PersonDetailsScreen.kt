@Composable
fun PersonDetailsScreen(
    personId: String,
    onBack: () -> Unit,
    onEdit: (Person) -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: PersonDetailsViewModel = viewModel()
    val person by viewModel.person.collectAsState()
    val relations by viewModel.relations.collectAsState()

    LaunchedEffect(personId) {
        viewModel.loadPerson(personId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(person?.let { "${it.firstName} ${it.lastName}" } ?: "") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { person?.let { onEdit(it) } }) {
                        Icon(Icons.Default.Edit, "Edit")
                    }
                }
            )
        }
    ) { padding ->
        person?.let { p ->
            Column(
                modifier = modifier
                    .padding(padding)
                    .padding(16.dp)
            ) {
                PersonHeader(person = p)
                RelationsList(
                    relations = relations,
                    modifier = Modifier.padding(top = 16.dp)
                )
            }
        }
    }
}

@Composable
private fun PersonHeader(
    person: Person,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            person.photoUrl?.let { url ->
                AsyncImage(
                    model = url,
                    contentDescription = "Photo of ${person.firstName}",
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .align(Alignment.CenterHorizontally)
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            InfoRow("Birth Date", person.birthDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
            person.deathDate?.let { date ->
                InfoRow("Death Date", date.format(DateTimeFormatter.ISO_LOCAL_DATE))
            }
        }
    }
}

@Composable
private fun InfoRow(
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

@Composable
private fun RelationsList(
    relations: List<Relation>,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(
            text = "Family Relations",
            style = MaterialTheme.typography.titleMedium,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        LazyColumn {
            items(relations) { relation ->
                RelationItem(relation = relation)
            }
        }
    }
}