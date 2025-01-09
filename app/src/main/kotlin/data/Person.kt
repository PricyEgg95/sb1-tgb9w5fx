data class Person(
    val id: String = UUID.randomUUID().toString(),
    val firstName: String,
    val lastName: String,
    val birthDate: LocalDate,
    val deathDate: LocalDate? = null,
    val photoUrl: String? = null
)

sealed class Screen {
    object PeopleList : Screen()
    data class PersonDetails(val personId: String) : Screen()
    object AddPerson : Screen()
    data class EditPerson(val personId: String) : Screen()
}