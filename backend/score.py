def calculate_kaam_score(
    years_experience: int,
    daily_income: int,
    skill: str,
    city: str,
    employer_name: str
) -> dict:
    
    # Experience points (Max 40)
    exp_points = 0
    if 1 <= years_experience <= 2:
        exp_points = 10
    elif 3 <= years_experience <= 5:
        exp_points = 20
    elif 6 <= years_experience <= 10:
        exp_points = 30
    elif years_experience > 10:
        exp_points = 40
    
    # Income points (Max 20)
    income_points = 0
    if daily_income <= 300:
        income_points = 5
    elif daily_income <= 600:
        income_points = 10
    elif daily_income <= 1000:
        income_points = 15
    else:
        income_points = 20
    
    # Skill points (Max 15)
    if skill == "Other":
        skill_points = 5
    else:
        skill_points = 15
    
    # Location points (Max 10)
    location_points = 0
    major_cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune"]
    if city in major_cities:
        location_points = 10
    else:
        location_points = 5
    
    # Employer points (Max 15)
    if employer_name and employer_name.strip():
        employer_points = 15
    else:
        employer_points = 0
    
    total = exp_points + income_points + skill_points + location_points + employer_points
    total = min(total, 100)
    
    grade = ""
    if total <= 40:
        grade = "Bronze"
    elif total <= 65:
        grade = "Silver"
    elif total <= 85:
        grade = "Gold"
    else:
        grade = "Platinum"
    
    return {
        "total": total,
        "grade": grade,
        "breakdown": {
            "experience": exp_points,
            "income": income_points,
            "skill": skill_points,
            "location": location_points,
            "employer": employer_points
        }
    }