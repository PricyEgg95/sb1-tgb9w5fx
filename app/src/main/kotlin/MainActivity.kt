import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FamilyTreeTheme {
                FamilyTreeApp()
            }
        }
    }
}

@Composable
fun FamilyTreeApp() {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.PeopleList) }
    
    NavHost(currentScreen) { screen ->
        when (screen) {
            is Screen.PeopleList -> PeopleListScreen(
                onPersonClick = { person -> 
                    currentScreen = Screen.PersonDetails(person.id)
                },
                onAddClick = {
                    currentScreen = Screen.AddPerson
                }
            )
            is Screen.PersonDetails -> PersonDetailsScreen(
                personId = screen.personId,
                onBack = { currentScreen = Screen.PeopleList },
                onEdit = { person -> 
                    currentScreen = Screen.EditPerson(person.id)
                }
            )
            is Screen.AddPerson -> PersonFormScreen(
                onBack = { currentScreen = Screen.PeopleList }
            )
            is Screen.EditPerson -> PersonFormScreen(
                personId = screen.personId,
                onBack = { currentScreen = Screen.PeopleList }
            )
        }
    }
}