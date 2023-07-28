import pymongo
from flask import Flask, render_template, request
from bson.objectid import ObjectId

app = Flask(__name__)
client = pymongo.MongoClient(
    "mongodb+srv://r8:2gajHpLf5erbuXh@r8.httejvu.mongodb.net/?retryWrites=true&w=majority")


@app.route("/")
def character_list():
    char_list = client.player.character.find({})

    addrs = [
        f'<li><a href="/character?id={char.get("_id")}">{char.get("name")}</a></li>'
        for char in char_list
    ]

    return '<ul>' + '\n'.join(addrs) + '</ul>'


@app.route("/character")
def character_sheet_page():
    if objId := request.args.get('id'):
        __filter = {"_id": ObjectId(objId)}

        context = {
            'character': client.player.character.find_one(__filter),
            'skills': client.player.skills.find_one(__filter),
            'status': client.player.status.find_one(__filter),
            'items': client.player.items.find({"owner": ObjectId(objId)}),
        }

        print(f'{context=}')

        return render_template("character_sheet.html", **context, enumerate=enumerate, sum=sum)

    return {}


@app.route("/character/update", methods=['GET', 'POST'])
def character_update():
    params = dict(request.json)

    id = params.pop('id')
    db = params.pop('_db')

    try:
        params = {
            key: int(val) if val.isdigit() else val
            for key, val in params.items()
        }

        __filter = {'_id': ObjectId(id)}
        update = {"$set": params}

        client.player[db].update_one(__filter, update, upsert=True)

        return params

    except:
        return {}


@app.route("/character/upload_image", methods=['GET', 'POST'])
def character_image_upload():
    params = dict(request.json)

    id = params.pop('id')
    url = params.pop('url')

    __filter = {'_id': ObjectId(id)}
    client.player.character.update_one(__filter, {'$push': {'images': url}})

    return {'url': url}


@app.route("/character/create_new_item", methods=['GET', 'POST'])
def character_create_new_item():
    params = dict(request.json)

    id = params.pop("id")

    client.player.items.insert_one({
        "owner": ObjectId(id),
        "name": "Novo Item",
        "desc": "...",
        "quant": 1,
        "bonus": 0,
        "wu": 0,
    })

    return {}


@app.route("/character/item/update", methods=['GET', 'POST'])
def character_item_update():
    params = dict(request.json)

    id = params.pop('id')
    db = params.pop('_db')

    print(id, db, params)

    try:
        params = {
            key: int(val) if val.isdigit() else val
            for key, val in params.items()
        }

        __filter = {'_id': ObjectId(id)}
        update = {"$set": params}

        client.player[db].update_one(__filter, update, upsert=True)

        return params

    except:
        return {}


@app.route("/character/item/remove", methods=['GET', 'POST'])
def character_remove_item():
    params = dict(request.json)

    id = params.pop('id')
    client.player.items.find_one_and_delete({'_id': ObjectId(id)})

    return {}


if __name__ == "__main__":
    app.run(host="0.0.0.0")
