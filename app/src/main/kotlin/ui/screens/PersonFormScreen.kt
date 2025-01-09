@Composable
fun PersonFormScreen(
    personId: String? = null,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: PersonFormViewModel = viewModel()
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(personId) {
        personId?.let { viewModel.loadPerson(it) }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (personId != null) "Edit Person" else "Add Person") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = modifier
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            if (uiState.photoUrl != null) {
                AsyncImage(
                    model = uiState.photoUrl,
                    contentDescription = "Person photo",
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .align(Alignment.CenterHorizontally)
                        .clickable { viewModel.onSelectPhoto() }
                )
            } else {
                Button(
                    onClick = { viewModel.onSelectPhoto() },
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Icon(Icons.Default.Add, "Add photo")
                    Spacer(Modifier.width(8.dp))
                    Text("Add Photo")
                }
            }

            Spacer(Modifier.height(16.dp))

            OutlinedTextField(
                value = uiState.firstName,
                onValueChange = { viewModel.updateFirstName(it) },
                label = { Text("First Name") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(Modifier.height(8.dp))

            OutlinedTextField(
                value = uiState.lastName,
                onValueChange = { viewModel.updateLastName(it) },
                label = { Text("Last Name") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(Modifier.height(16.dp))

            Text("Birth Date", style = MaterialTheme.typography.bodyMedium)
            DatePicker(
                date = uiState.birthDate,
                onDateSelected = { viewModel.updateBirthDate(it) }
            )

            Spacer(Modifier.height(16.dp))

            Text("Death Date (Optional)", style = MaterialTheme.typography.bodyMedium)
            DatePicker(
                date = uiState.deathDate,
                onDateSelected = { viewModel.updateDeathDate(it) },
                nullable = true
            )

            Spacer(Modifier.height(24.dp))

            Button(
                onClick = { viewModel.savePerson() },
                modifier = Modifier.fillMaxWidth(),
                enabled = uiState.isValid
            ) {
                Text(if (personId != null) "Save Changes" else "Add Person")
            }
        }
    }
}