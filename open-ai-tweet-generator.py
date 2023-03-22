import openai
import tweepy

# Authenticate with the Twitter API
consumer_key = "YOUR_CONSUMER_KEY"
consumer_secret = "YOUR_CONSUMER_SECRET"
access_token = "YOUR_ACCESS_TOKEN"
access_token_secret = "YOUR_ACCESS_TOKEN_SECRET"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# Authenticate with the OpenAI API
openai.api_key = "YOUR_OPENAI_API_KEY"

# Get the Twitter profile to analyze
profile = input("Enter a Twitter profile to analyze: ")

# Get the user's last 5 tweets
tweets = api.user_timeline(screen_name=profile, count=5)

# Join the text of the tweets into a single string
tweet_text = " ".join([tweet.text for tweet in tweets])

# Use OpenAI to generate the next tweet suggestion
prompt = f"Write a tweet that follows these 5 tweets by {profile}: {tweet_text}"
response = openai.Completion.create(
  engine="text-davinci-002",
  prompt=prompt,
  max_tokens=128,
  n=1,
  stop=None,
  temperature=0.5,
)

# Print the suggested tweet
print(response.choices[0].text.strip())
