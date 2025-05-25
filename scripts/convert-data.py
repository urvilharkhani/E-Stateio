import os
import json
import random

def convert_property_data(input_json):
    import uuid
    import random
    import faker
    fake = faker.Faker()

    rating = round(random.uniform(3.0, 5.0), 1)
    avatar_number = random.randint(1, 100)

    # Helper for non-empty string
    def non_empty(val, fallback):
        if val is None or (isinstance(val, str) and not val.strip()):
            return fallback
        return val

    # Generate fake data
    fake_id = str(uuid.uuid4())
    fake_title = fake.street_address()
    fake_city = fake.city()
    fake_state = fake.state_abbr()
    fake_location = f"{fake_city}, {fake_state}"
    fake_price = random.randint(100000, 900000)
    fake_currency = "CAD"
    fake_status = random.choice(["sale", "rent"])
    fake_type = random.choice(["Single Family", "Apartment", "Condo", "Townhouse"])
    fake_description = fake.text(max_nb_chars=200)
    fake_image = f"https://picsum.photos/seed/{random.randint(1,1000)}/600/400"
    fake_images = [f"https://picsum.photos/seed/{random.randint(1001,2000)}/600/400"]
    fake_beds = random.randint(1, 5)
    fake_baths = random.randint(1, 4)
    fake_lot_area = random.randint(500, 5000)
    fake_lot_units = random.choice(["sqft", "sqm"])
    fake_broker = fake.name()
    fake_zip = fake.postcode()
    fake_lat = float(fake.latitude())
    fake_lon = float(fake.longitude())

    output_json = {
        "id": non_empty(input_json.get("id"), fake_id),
        "title": non_empty(input_json.get("fullAddress"), non_empty(input_json.get("street"), fake_title)),
        "location": non_empty(f'{input_json.get("city", "")}, {input_json.get("state", "")}', fake_location),
        "price": input_json.get("price") if input_json.get("price") not in [None, "", 0] else fake_price,
        "currency": non_empty(input_json.get("currency"), fake_currency),
        "rating": rating,
        "status": ("rent" if input_json.get("status") == "FOR_RENT" else non_empty(input_json.get("status", "").replace("FOR_", "").lower(), fake_status)),
        "type": ("Single Family" if input_json.get("homeType") == "SINGLE_FAMILY" else non_empty(input_json.get("homeType", "").replace("_", " ").title(), fake_type)),
        "description": non_empty(input_json.get("description"), fake_description),
        "image": non_empty(input_json.get("image"), fake_image),
        "images": (
            [s.strip() for s in input_json.get("photos").split(",") if s.strip()]
            if isinstance(input_json.get("photos"), str) else fake_images
        ),
        "features": [
            {
                "icon": "bed-outline",
                "label": f'{input_json.get("beds") if input_json.get("beds") not in [None, ""] else fake_beds} Bedroom'
            },
            {
                "icon": "water-outline",
                "label": f'{input_json.get("baths") if input_json.get("baths") not in [None, ""] else fake_baths} Bathroom'
            },
            {
                "icon": "resize-outline",
                "label": f'{int(input_json.get("lotArea")) if str(input_json.get("lotArea")).isdigit() else int(fake_lot_area)} {input_json.get("lotAreaUnits") if input_json.get("lotAreaUnits") not in [None, ""] else fake_lot_units}'
            }
        ],
        "agent": {
            "name": non_empty(input_json.get("brokerName"), fake_broker),
            "image": f"https://i.pravatar.cc/100?img={avatar_number}"
        },
        "zipcode": non_empty(input_json.get("zipcode"), fake_zip),
        "latitude": input_json.get("latitude") if input_json.get("latitude") not in [None, ""] else fake_lat,
        "longitude": input_json.get("longitude") if input_json.get("longitude") not in [None, ""] else fake_lon
    }

    return output_json

def process_folder(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    for filename in os.listdir(input_folder):
        if filename.endswith('.json'):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)
            with open(input_path, 'r', encoding='utf-8') as infile:
                data = json.load(infile)
            # If the file contains a list of properties
            if isinstance(data, list):
                converted = [convert_property_data(item) for item in data]
            else:
                converted = convert_property_data(data)
            with open(output_path, 'w', encoding='utf-8') as outfile:
                json.dump(converted, outfile, indent=2, ensure_ascii=False)
            print(f"Processed {filename}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_folder = os.path.join(script_dir, "input")
    output_folder = "C:\\Users\\anton\\second-brain\\1-projects\\Mobile_Programming\\Group-challenge-2\\E-Stateio\\src\\data\\"
    print(f"Input folder: {input_folder}")
    print(f"Output folder: {output_folder}")
process_folder(input_folder, output_folder)
