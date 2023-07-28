import pymongo
from bson.objectid import ObjectId

client = pymongo.MongoClient(
    "mongodb+srv://r8:2gajHpLf5erbuXh@r8.httejvu.mongodb.net/?retryWrites=true&w=majority")


CHARACTER_TEMPLATE = {
    "inspiration_points": 0,
    "progression_points": 0,
    "images": [],
}

STATUS_TEMPLATE = {
    "health": [0, 0],
    "energy": [0, 0],
}


def insert_new_player_character(name: str):
    if client.player.character.find_one({"name": name}):
        print("Unavailable name")
        return

    doc = CHARACTER_TEMPLATE | {'name': name}
    objId = client.player.character.insert_one(doc).inserted_id
    client.player.status.insert_one(STATUS_TEMPLATE | {'_id': ObjectId(objId)})
    client.player.skills.insert_one({'_id': ObjectId(objId)})

    return objId


if __name__ == '__main__':
    from sys import argv

    id = insert_new_player_character(argv[1])
    print(f'Inserted {id}')
