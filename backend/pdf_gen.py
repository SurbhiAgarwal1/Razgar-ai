import io
import json
import qrcode
import base64
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from models import ProfileOutput


GRADE_COLORS = {
    "Bronze": "#cd7f32",
    "Silver": "#a8a9ad",
    "Gold": "#ffd700",
    "Platinum": "#6c7a89"
}


def generate_qr(data: dict) -> io.BytesIO:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(json.dumps(data))
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    img_buffer = io.BytesIO()
    img.save(img_buffer)
    img_buffer.seek(0)
    return img_buffer


def generate_pdf(profile: ProfileOutput) -> bytes:
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A5,
        leftMargin=0.5*inch,
        rightMargin=0.5*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    navy = colors.HexColor("#1a1a2e")
    grade_color = colors.HexColor(GRADE_COLORS.get(profile.grade, "#6c7a89"))
    
    # Header
    story.append(Paragraph(f"<b>ROZGARAI VERIFIED WORKER</b>", ParagraphStyle(
        'Header', fontSize=10, textColor=navy, alignment=TA_CENTER, spaceAfter=20, tracking=2
    )))

    # Profile Section (Photo + Name)
    header_content = []
    
    name_section = [
        Paragraph(f"<b>{profile.name}</b>", ParagraphStyle('Name', fontSize=24, textColor=navy)),
        Paragraph(f"{profile.skill} • {profile.city}", ParagraphStyle('Subtitle', fontSize=12, textColor=colors.gray, spaceAfter=20))
    ]
    
    if profile.photo_base64:
        try:
            # Remove header if exists
            p_data = profile.photo_base64
            if "," in p_data:
                p_data = p_data.split(",")[1]
            img_data = base64.b64decode(p_data)
            img_buffer = io.BytesIO(img_data)
            photo_img = Image(img_buffer, width=1*inch, height=1.2*inch)
            
            header_table = Table([[name_section, photo_img]], colWidths=[3*inch, 1.2*inch])
            header_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ]))
            story.append(header_table)
        except:
            story.extend(name_section)
    else:
        story.extend(name_section)

    story.append(Spacer(1, 0.1*inch))

    # Score Box
    score_data = [
        [
            Paragraph(f"<font size=48 color='{grade_color}'><b>{profile.kaam_score}</b></font><br/><font size=12 color='{grade_color}'><b>{profile.grade}</b></font>", ParagraphStyle('Score', alignment=TA_CENTER)),
            [
                Paragraph(f"<b>Score Breakdown</b>", ParagraphStyle('BDHeader', fontSize=10, textColor=navy, spaceAfter=5)),
                Paragraph(f"Experience: +{profile.breakdown.get('experience', 0)} pts", ParagraphStyle('BDItem', fontSize=8)),
                Paragraph(f"Income: +{profile.breakdown.get('income', 0)} pts", ParagraphStyle('BDItem', fontSize=8)),
                Paragraph(f"Skill: +{profile.breakdown.get('skill', 0)} pts", ParagraphStyle('BDItem', fontSize=8)),
                Paragraph(f"Location: +{profile.breakdown.get('location', 0)} pts", ParagraphStyle('BDItem', fontSize=8)),
                Paragraph(f"Verified: +{profile.breakdown.get('employer', 0)} pts", ParagraphStyle('BDItem', fontSize=8)),
            ]
        ]
    ]
    score_table = Table(score_data, colWidths=[1.5*inch, 2.5*inch])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.whitesmoke),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 0.3*inch))

    # Bios
    story.append(Paragraph(f"<b>Professional Profile</b>", ParagraphStyle('Label', fontSize=10, textColor=navy, spaceAfter=5)))
    story.append(Paragraph(profile.bio, ParagraphStyle('Bio', fontSize=11, leading=14)))
    story.append(Spacer(1, 0.05*inch))
    story.append(Paragraph(profile.hindi_bio, ParagraphStyle('HindiBio', fontSize=10, textColor=colors.gray, leading=12)))
    story.append(Spacer(1, 0.2*inch))

    # Skills
    story.append(Paragraph(f"<b>Key Skills</b>", ParagraphStyle('Label', fontSize=10, textColor=navy, spaceAfter=5)))
    skills_text = "  •  ".join(profile.skills)
    story.append(Paragraph(skills_text, ParagraphStyle('Skills', fontSize=9, textColor=navy)))
    story.append(Spacer(1, 0.2*inch))

    # Achievement
    story.append(Paragraph(f"<b>Top Achievement</b>", ParagraphStyle('Label', fontSize=10, textColor=navy, spaceAfter=5)))
    story.append(Paragraph(f"★ {profile.achievement}", ParagraphStyle('Achievement', fontSize=10, textColor=colors.HexColor("#f59e0b"))))
    
    story.append(Spacer(1, 0.4*inch))

    # Footer with QR
    ref_id = f"RAZ-{hash(profile.name) % 1000000:06d}"
    qr_data = {
        "name": profile.name,
        "city": profile.city,
        "skill": profile.skill,
        "kaam_score": profile.kaam_score,
        "grade": profile.grade,
        "ref": ref_id,
        "verified_by": "RozgarAI",
        "date": profile.generated_at
    }
    qr_buffer = generate_qr(qr_data)
    qr_img = Image(qr_buffer, width=1*inch, height=1*inch)

    footer_data = [
        [
            qr_img,
            [
                Paragraph(f"<b>SCAN TO VERIFY</b>", ParagraphStyle('Scan', fontSize=8, textColor=navy)),
                Paragraph(f"REF: {ref_id}", ParagraphStyle('Ref', fontSize=8, fontName='Courier')),
                Spacer(1, 10),
                Paragraph(f"Verified by RozgarAI | rozgarai.in", ParagraphStyle('Web', fontSize=7, textColor=colors.gray)),
                Paragraph(f"Generated: {profile.generated_at}", ParagraphStyle('Date', fontSize=7, textColor=colors.gray)),
            ]
        ]
    ]
    footer_table = Table(footer_data, colWidths=[1.1*inch, 3*inch])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(footer_table)
    
    doc.build(story)
    buffer.seek(0)
    return buffer.read()