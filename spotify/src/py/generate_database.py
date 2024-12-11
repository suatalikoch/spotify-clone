import random
import json
from faker import Faker

fake = Faker()

def generate_artist(artist_id):
    return {
        "artist_id": artist_id,
        "name": fake.name(),
        "genre": random.choice(["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"]),
        "bio": fake.text(),
        "profile_picture": fake.image_url()
    }

def generate_album(album_id, artist_id):
    return {
        "album_id": album_id,
        "artist_id": artist_id,
        "title": fake.bs(),
        "release_date": fake.date(),
        "cover_image": fake.image_url(),
        "genre": random.choice(["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"]),
        "songs": [str(random.randint(1, 5000)) for _ in range(random.randint(5, 15))]
    }

def generate_song(song_id, album_id, artist_id):
    return {
        "song_id": song_id,
        "album_id": album_id,
        "artist_id": artist_id,
        "title": fake.sentence(),
        "duration": f"{random.randint(3, 5)}:{random.randint(10, 59):02d}",
        "file_path": f"path_to_song_{song_id}.mp3",
        "genre": random.choice(["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"]),
        "release_date": fake.date()
    }

def generate_user(user_id):
    return {
        "user_id": user_id,
        "username": fake.user_name(),
        "email": fake.email(),
        "password_hash": fake.sha256(),
        "profile_picture": fake.image_url(),
        "subscription_type": random.choice(["Free", "Premium"]),
        "playlists": [str(random.randint(1, 10000)) for _ in range(random.randint(1, 10))]
    }

def generate_playlist(playlist_id, user_id):
    return {
        "playlist_id": playlist_id,
        "user_id": user_id,
        "title": fake.bs(),
        "description": fake.text(),
        "songs": [str(random.randint(1, 5000)) for _ in range(random.randint(3, 15))]
    }

# Generate data
artists = [generate_artist(i) for i in range(1, 1001)]
albums = [generate_album(i, random.randint(1, 1000)) for i in range(1, 1001)]
songs = [generate_song(i, random.randint(1, 1000), random.randint(1, 1000)) for i in range(1, 5001)]
users = [generate_user(i) for i in range(1, 5001)]
playlists = [generate_playlist(i, random.randint(1, 5000)) for i in range(1, 10001)]

# Create final structure
database = {
    "artists": artists,
    "albums": albums,
    "songs": songs,
    "users": users,
    "playlists": playlists
}

# Output to JSON file
with open("D:/Projects/Github/spotify-clone/spotify/src/json/database.json", "w") as f:
    json.dump(database, f, indent=4)

print("Database generated successfully!")
