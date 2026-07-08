from backend.state_machine import state
from backend.locations import LOCATIONS


def change_location():

    current = state["location"]

    next_location = LOCATIONS[current]["next"]

    if next_location is None:
        return {
            "message": "Journey completed"
        }

    state["location"] = next_location

    if next_location not in state["visited"]:
        state["visited"].append(next_location)

    return {
        "new_location": next_location
    }


def check_trail_permit():

    if state["permit"]:
        return {
            "permit": True,
            "message": "Permit already granted."
        }

    return {
        "permit": False,
        "message": "Traveller needs a permit."
    }


def look_up_artifact(name):

    artifacts = {
        "sun_gate":
            "Inti Punku (Sun Gate) was the traditional entrance to Machu Picchu.",

        "temple_of_the_sun":
            "Temple of the Sun was an important ceremonial site for the Incas.",

        "intihuatana":
            "The Intihuatana Stone is believed to have been used as an astronomical calendar.",

        "royal_tomb":
            "The Royal Tomb is a carved cave structure beneath the Temple of the Sun."
    }

    return {
        "artifact": name,
        "information": artifacts.get(
            name.lower(),
            "Artifact not found."
        )
    }