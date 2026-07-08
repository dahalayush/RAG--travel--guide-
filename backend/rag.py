import chromadb

client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_collection("peru_guide")

results = collection.query(
    query_texts=["Tell me about terraces"],
    n_results=1
)

print(results)