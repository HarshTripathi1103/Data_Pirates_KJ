import streamlit as st
from dotenv import load_dotenv
import os
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

prompt = """You are a YouTube video summarizer. You will be taking the transcript text
and summarizing the entire video and providing the important summary in points
within 250 words. Please provide the summary of the text given here: """

# Function to extract transcript details from YouTube videos
def extract_transcript_details(youtube_video_url):
    try:
        video_id = youtube_video_url.split("v=")[1]  # Use 'v=' for ID extraction
        # Specify the language codes you want to try
        transcript_text = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'hi'])

        transcript = " ".join([i["text"] for i in transcript_text])  # Join transcript texts
        return transcript
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        st.error(f"Transcripts are disabled or not available for this video: {e}")
        return None
    except Exception as e:
        st.error(f"Error extracting transcript: {e}")
        return None

# Function to generate content using Google Gemini
def generate_gemini_content(transcript_text, prompt):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt + transcript_text)
    return response.text

# Streamlit app layout
st.title("Video Summarizer Converter")
youtube_link = st.text_input("Enter YouTube Video Link:")

if youtube_link:
    video_id = youtube_link.split("v=")[1]  # Use 'v=' for ID extraction
    st.image(f"http://img.youtube.com/vi/{video_id}/0.jpg", use_column_width=True)

if st.button("Get Detailed Notes"):
    transcript_text = extract_transcript_details(youtube_link)
    
    if transcript_text:
        with st.spinner("Generating detailed notes..."):
            summary = generate_gemini_content(transcript_text, prompt)
        st.markdown("## Detailed Notes:")
        st.write(summary)
