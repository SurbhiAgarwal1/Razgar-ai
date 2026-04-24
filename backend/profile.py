import os
import json
from openai import AsyncOpenAI, OpenAIError
from models import WorkerInput


async def generate_profile(worker: WorkerInput) -> dict:
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    # Fallback to Mock Data if API Key is missing (for demo/testing)
    if not api_key or api_key == "YOUR_OPENAI_API_KEY":
        return {
            "bio": f"{worker.name} is a highly skilled {worker.skill} from {worker.city} with {worker.years_experience} years of hands-on experience. Known for exceptional craftsmanship and reliability in all local projects.",
            "hindi_bio": f"{worker.name} {worker.city} se ek behad kushal {worker.skill} hain jinke paas {worker.years_experience} saal ka anubhav hai. Wo apne kaam ki quality aur bharosemand hone ke liye jaane jaate hain.",
            "skills": [f"Expert {worker.skill}", "Material Management", "Technical Troubleshooting"],
            "achievement": f"Completed over {worker.years_experience * 5}+ major contracts with 100% on-time delivery.",
            "trust_statement": f"A trusted professional in the {worker.city} work community with a proven history of integrity.",
            "reviews": [
                {"author": "Ramesh Kumar (Contractor)", "comment": "Bohot hi mehanti aur imandaar aadmi hain. Kaam ki quality hamesha top rehti hai."},
                {"author": "Sunil Mehta (Site Supervisor)", "comment": "Rajesh finishes projects on time. His technical skills are outstanding."}
            ],
            "signature_name": worker.name,
            "interview_tips": [
                "Bataiye ki aapne pehle kitne bade projects kiye hain.",
                "Hamesha apne tools saath rakhein jab client se milne jaayein.",
                "Kaam khatam karne ki deadline par zaroor baat karein."
            ]
        }

    client = AsyncOpenAI(api_key=api_key)
    
    employer_display = worker.employer_name if worker.employer_name else "Self-employed"
    
    system_prompt = """You are a professional profile writer and career coach 
for blue-collar workers in India. Your goals are to build worker 
dignity and help them land jobs. Write with warmth and authority."""
    
    user_prompt = f"""Generate a professional profile and job tips for:
Name: {worker.name}
Trade: {worker.skill}
City: {worker.city}
Experience: {worker.years_experience} years
Daily income: Rs. {worker.daily_income}
Employer: {employer_display}

Return ONLY valid JSON with these exact keys:
{{
    "bio": "2 sentence professional bio in third person, specific to their trade",
    "hindi_bio": "Same bio written in simple conversational Hindi — aise likho jaise koi dost bata raha ho, koi formal nahi",
    "skills": ["skill1", "skill2", "skill3"],
    "achievement": "One specific achievement line based on their experience years",
    "trust_statement": "One line for lenders/employers about why this worker is reliable",
    "reviews": [
        {{"author": "Contractor Name", "comment": "Short professional testimonial about their work"}},
        {{"author": "Employer Name", "comment": "Short professional testimonial about their work"}}
    ],
    "signature_name": "Full name for digital signature",
    "interview_tips": [
        "Tip 1 in Hindi for the worker to land a job",
        "Tip 2 in Hindi for the worker to land a job",
        "Tip 3 in Hindi for the worker to land a job"
    ]
}}

Rules:
- interview_tips must be in conversational Hindi (Devanagari script), giving advice on how to talk to new employers for their specific trade.
- Return pure JSON only, no markdown."""
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        profile_data = json.loads(content)
        
        return {
            "bio": profile_data.get("bio", ""),
            "hindi_bio": profile_data.get("hindi_bio", ""),
            "skills": profile_data.get("skills", []),
            "achievement": profile_data.get("achievement", ""),
            "trust_statement": profile_data.get("trust_statement", ""),
            "reviews": profile_data.get("reviews", []),
            "signature_name": profile_data.get("signature_name", worker.name),
            "interview_tips": profile_data.get("interview_tips", [])
        }
        
    except OpenAIError as e:
        raise ValueError(f"AI service error: {str(e)}")