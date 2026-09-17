import csv
import json
import sys

INPUT = sys.argv[1] if len(sys.argv) > 1 else "parc_immobilier_etat_20231231.csv"
OUTPUT = "data/biens-etat.json"

# Ne garde que les champs utiles à la carte (filtres + popup), avec des clés courtes
FIELD_MAP = {
    "latitude": "lat",
    "longitude": "lon",
    "surface_m2": "surface",
    "type": "type",
    "fonction": "fonction",
    "ministere": "ministere",
    "libelle_nouvelle_region": "region",
    "dept": "dept",
    "ville": "ville",
    "etat_de_sante": "etat",
}
NUMERIC_FIELDS = {"lat", "lon", "surface"}

biens = []
with open(INPUT, encoding="utf-8-sig") as f:
    reader = csv.DictReader(f, delimiter=";")
    for row in reader:
        if row.get("latitude") in (None, "", "-") or row.get("longitude") in (None, "", "-"):
            continue
        bien = {}
        for src, dest in FIELD_MAP.items():
            value = row.get(src, "")
            bien[dest] = float(value) if dest in NUMERIC_FIELDS else value
        biens.append(bien)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(biens, f, ensure_ascii=False, separators=(",", ":"))

print(f"{len(biens)} biens géolocalisés écrits dans {OUTPUT}")
