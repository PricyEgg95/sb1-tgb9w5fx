@HiltViewModel
class PersonDetailsViewModel @Inject constructor(
    private val personRepository: PersonRepository
) : ViewModel() {
    
    private val _person = MutableStateFlow<Person?>(null)
    val person: StateFlow<Person?> = _person.asStateFlow()
    
    private val _relations = MutableStateFlow<List<Relation>>(emptyList())
    val relations: StateFlow<List<Relation>> = _relations.asStateFlow()
    
    fun loadPerson(id: String) {
        viewModelScope.launch {
            _person.value = personRepository.getPerson(id)
            _relations.value = personRepository.getRelations(id)
        }
    }
}