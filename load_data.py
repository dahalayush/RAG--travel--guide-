import chromadb
from pathlib import Path

client = chromadb.PersistentClient(path="./chroma_db")

try:
    client.delete_collection("peru_guide")
except:
    pass

collection = client.create_collection("peru_guide")

data_folder = Path("data")

files = [
    ("trailhead.md", "trailhead"),
    ("winay_walay.md", "winay_wayna"),
    ("citadel.md", "machu_picchu")
]

for filename, location in files:

    text = (data_folder / filename).read_text(encoding="utf-8")

    collection.add(
        documents=[text],
        ids=[location],
        metadatas=[
            {
                "location": location
            }
        ]
    )

print("Peru guide data loaded successfully.")