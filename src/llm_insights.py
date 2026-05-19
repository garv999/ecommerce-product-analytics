import os
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# LOAD ENV VARIABLES
load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    raise ValueError("OPENROUTER_API_KEY not found in .env file")

# OPENROUTER CLIENT
client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1"
)

# LOAD DATASET
print("Loading player dataset...")

file_path = Path("data/processed/final_player_features.csv")

df = pd.read_csv(file_path)

print("Dataset loaded successfully!")

# GET PLAYER DATA
def get_player_data(player_name):

    player = df[
        df["player_name"].str.lower() == player_name.lower()
    ]

    if player.empty:
        return None

    return player.iloc[0]

# GENERATE AI INSIGHTS
def generate_player_insight(player_name):

    player = get_player_data(player_name)

    if player is None:
        print(f"Player '{player_name}' not found.")
        return

    # Select important attributes
    attributes = {
        "overall_rating": player["overall_rating"],
        "potential": player["potential"],
        "dribbling": player["dribbling"],
        "finishing": player["finishing"],
        "ball_control": player["ball_control"],
        "vision": player["vision"],
        "stamina": player["stamina"],
        "strength": player["strength"],
        "agility": player["agility"],
        "sprint_speed": player["sprint_speed"]
    }

    prompt = f"""
    You are a professional football scout and AI analyst.

    Analyze the following football player attributes and generate a scouting report.

    Player Name: {player_name}

    Attributes:
    {attributes}

    Explain:
    - player strengths
    - weaknesses
    - playstyle
    - ideal tactical role
    - development potential

    Keep the response concise and professional.
    """

    print("\nGenerating AI scouting report...\n")

    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )
    insight = response.choices[0].message.content
    print("=" * 60)
    print(f"AI SCOUTING REPORT: {player_name}")
    print("=" * 60)
    print(insight)

# TEST
generate_player_insight("Lionel Messi")