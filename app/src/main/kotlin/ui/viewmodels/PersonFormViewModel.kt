@HiltViewModel
class PersonFormViewModel @Inject constructor(
    private val personRepository: PersonRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(PersonFormState())
    val uiState: StateFlow<PersonFormState> = _uiState.asStateFlow()

    fun loadPerson(id: String) {
        viewModelScope.launch {
            personRepository.getPerson(id)?.let { person ->
                _uiState.value = PersonFormState(
                    firstName = person.firstName,
                    lastName = person.lastName,
                    birthDate = person.birthDate,
                    deathDate = person.deathDate,
                    photoUrl = person.photoUrl
                )
            }
        }
    }

    fun updateFirstName(value: String) {
        _uiState.value = _uiState.value.copy(firstName = value)
    }

    fun updateLastName(value: String) {
        _uiState.value = _uiState.value.copy(lastName = value)
    }

    fun updateBirthDate(value: LocalDate) {
        _uiState.value = _uiState.value.copy(birthDate = value)
    }

    fun updateDeathDate(value: LocalDate?) {
        _uiState.value = _uiState.value.copy(deathDate = value)
    }

    fun onSelectPhoto() {
        // TODO: Implement photo selection
    }

    fun savePerson() {
        viewModelScope.launch {
            val state = _uiState.value
            val person = Person(
                firstName = state.firstName,
                lastName = state.lastName,
                birthDate = state.birthDate,
                deathDate = state.deathDate,
                photoUrl = state.photoUrl
            )
            personRepository.savePerson(person)
        }
    }
}

data class PersonFormState(
    val firstName: String = "",
    val lastName: String = "",
    val birthDate: LocalDate = LocalDate.now(),
    val deathDate: LocalDate? = null,
    val photoUrl: String? = null
) {
    val isValid: Boolean
        get() = firstName.isNotBlank() && lastName.isNotBlank()
}