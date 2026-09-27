import json
import requests

api_url = "https://api.railradar.in/v1/legacy/trains/between?from=BSB&to=LKO"

response = requests.get(
    api_url,
    headers={"Authorization": "Bearer rg_9caa7c385ea54be3a0bc5be71a060673"},
)

# Open the file and use json.dump to write the dictionary directly as JSON
with open("data.json", "w") as f:
    json.dump(response.json(), f, indent=4)  # indent=4 makes the file human-readable

# Alternative quick fix if you don't want to import json:
# with open("data.json", "w") as f:
#     f.write(response.text)
