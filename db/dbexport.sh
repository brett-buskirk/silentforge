rm db/collections/characters.json
rm db/collections/classes.json
rm db/collections/datas.json
rm db/collections/races.json
mongoexport --db=silentforge --collection=characters --type=json --out=db/collections/characters.json --pretty
mongoexport --db=silentforge --collection=classes --type=json --out=db/collections/classes.json --pretty
mongoexport --db=silentforge --collection=datas --type=json --out=db/collections/datas.json --pretty
mongoexport --db=silentforge --collection=races --type=json --out=db/collections/races.json --pretty
