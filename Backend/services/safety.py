def check_safety(message, lang):
    # Basic rules: block explicit adult content, hate, slurs, violence, and other dangerous or illegal topics
    blocked_keywords = [
         "nsfw",
        "hardcore", "xxx", "child porn", "child abuse", "pedo", "pedophile",
        "incest", "molest", "molestation", "bestiality", "zoophilia", "beastiality",
        "kill", "suicide", "self-harm", "self harm", "cutting", "overdose", "die", "death",
        "murder", "execute", "hang", "asphyxiate", "asphyxiation", "choke", "slit", "stab", "shoot",
        "gun", "massacre", "terrorist", "terrorism", "bomb", "explosive", "attack",
        "hate", "racist", "racism", "homophobia", "homophobic", "transphobia", "transphobic",
        "slur", "slurs", "nigger", "faggot", "retard", "cunt", "bitch", "whore", "slut", "sodomy", "sodomize",
        "genital mutilation", "fgm", "circumcision video", "torture", "snuff", "necrophilia",
        "necrophile", "zoosadism", "scat", "coprophilia", "bestiality", "zoophilia",
        "abuse", "abusive","abduct", "abduction", "kidnap", "kidnapping",
        "enslave", "slavery", "slave", "traffick", "trafficking", "human trafficking",
        "exploit", "exploitation", "groom", "grooming", "solicit", "solicitation", "prostitute",
        "prostitution", "escort", "pimp", "sex trafficking", "drug", "drugs", "overdose"
    ]
    for kw in blocked_keywords:
        if kw in message.lower():
            return ["blocked"]
    return []

def classify_intent(message, lang):
    # Simple keyword-based; swap for ML later
    mapping = {
        "hiv": "HIV_prevention",
        "contracept": "contraception",
        "consent": "consent",
        "rape": "assault_support",
        "emergency": "emergency"
    }
    for k, v in mapping.items():
        if k in message.lower():
            return v
    return "basic_info"

def localized_system_prompt(lang, reading_level):
    prompts = {
        "en": f"You are SomaAI, a friendly, culturally respectful sexual-health educator for teens. Respond in English. Reading Level: {reading_level}.",
        "fr": f"Vous êtes SomaAI, un éducateur chaleureux et respectueux pour la santé sexuelle des adolescents. Répondez en français. Niveau de lecture : {reading_level}.",
        "pt": f"Você é o SomaAI, um educador amigável e respeitoso para saúde sexual de adolescentes. Responda em português. Nível de leitura: {reading_level}.",
        "es": f"Eres SomaAI, un educador amigable y respetuoso sobre salud sexual para adolescentes. Responde en español. Nivel de lectura: {reading_level}.",
        "sw": f"Wewe ni SomaAI, mwelekezaji rafiki na mwenye heshima kuhusu afya ya ngono kwa vijana. Jibu kwa Kiswahili. Kiwango cha usomaji: {reading_level}.",
        "hi": f"आप SomaAI हैं, एक मित्रवत, सांस्कृतिक रूप से संवेदनशील यौन स्वास्थ्य शिक्षक। हिंदी में उत्तर दें। पठन स्तर: {reading_level}।"
    }
    return prompts.get(lang, prompts["en"])

# HEALTH_ALLOWLIST unchanged, as provided above
HEALTH_ALLOWLIST = [

    "health", "healthy", "unhealthy", "medical", "medicine", "medication",
    "wellness", "wellbeing", "clinic", "hospital", "doctor", "nurse",
    "patient", "treatment", "therapy", "illness", "sick", "sickness",
    "disease", "condition", "emergency", "first aid", "healthcare",
    "physician", "consultation", "appointment", "visit", "diagnosis",
    "symptom", "symptoms", "infection", "fever", "temperature", "pain",
    "headache", "nausea", "prescription", "pill", "antibiotic",
    "vaccine", "vaccination", "shot", "allergy", "allergic", "immune",
    "immunity", "prevention", "cure", "recovery", "healing", "wound",
    "injury", "hurt", "ache", "sore", "tender", "swollen", "inflammation",
    
    # Body systems & parts (educational)
    "body", "anatomy", "physiology", "organ", "organs", "system",
    "blood", "heart", "cardiovascular", "circulation", "pulse",
    "blood pressure", "lungs", "respiratory", "breathing", "oxygen",
    "brain", "nervous", "neurological", "spine", "spinal cord",
    "liver", "kidney", "kidneys", "digestive", "stomach", "intestine",
    "bowel", "bladder", "urinary", "reproductive", "endocrine",
    "hormonal", "immune system", "lymphatic", "muscular", "skeletal",
    "bone", "bones", "joint", "joints", "cartilage", "tendon",
    "ligament", "muscle", "muscles", "tissue", "cell", "cells",
    "skin", "epidermis", "dermis", "hair", "nails", "pores",
    
    # Head & senses
    "head", "skull", "face", "forehead", "cheek", "chin", "jaw",
    "eye", "eyes", "vision", "sight", "blind", "blindness",
    "glasses", "contacts", "lens", "pupil", "iris", "retina",
    "cornea", "eyelid", "eyebrow", "eyelash", "tear", "tears",
    "ear", "ears", "hearing", "deaf", "deafness", "eardrum",
    "inner ear", "middle ear", "outer ear", "earwax", "tinnitus",
    "nose", "nostril", "nasal", "sinus", "sinuses", "smell",
    "mouth", "oral", "lips", "tongue", "teeth", "tooth",
    "dental", "gums", "saliva", "taste", "throat", "tonsils",
    "voice", "vocal cords", "larynx", "pharynx", "swallow",
    
    # Puberty & development - comprehensive
    "puberty", "adolescence", "teenager", "teen", "development",
    "growth", "maturation", "body changes", "growing up", "mature",
    "voice changes", "voice cracking", "deeper voice", "growth spurt",
    "height", "weight", "size", "proportion", "awkward", "clumsy",
    "coordination", "motor skills", "physical development",
    "emotional development", "cognitive development", "brain development",
    "frontal lobe", "decision making", "impulse control", "risk taking",
    "identity", "self-discovery", "independence", "autonomy",
    "peer influence", "social development", "friendship changes",
    
    # Skin & appearance changes
    "acne", "pimples", "zits", "blackheads", "whiteheads", "breakout",
    "oily skin", "dry skin", "sensitive skin", "combination skin",
    "skincare", "cleanser", "moisturizer", "sunscreen", "spf",
    "dermatology", "dermatologist", "rash", "eczema", "psoriasis",
    "mole", "freckle", "birthmark", "scar", "stretch marks",
    "body odor", "sweating", "perspiration", "sweat glands",
    "deodorant", "antiperspirant", "hygiene", "personal hygiene",
    "shower", "bath", "soap", "shampoo", "conditioner", "grooming",
    
    # Sexual & reproductive anatomy (educational)
    "reproductive system", "sexual organs", "genitals", "private parts",
    "external genitalia", "internal organs", "sex organs",
    "penis", "penile", "shaft", "glans", "foreskin", "circumcision",
    "testicles", "testis", "scrotum", "scrotal", "sperm", "semen",
    "prostate", "prostate gland", "urethra", "urethral opening",
    "vagina", "vaginal", "vulva", "vulvar", "labia", "clitoris",
    "clitoral", "hymen", "cervix", "cervical", "uterus", "uterine",
    "womb", "ovary", "ovaries", "ovarian", "fallopian tubes",
    "egg", "ovum", "ova", "breast", "breasts", "nipple", "nipples",
    "areola", "breast development", "chest", "mammary glands",
    
    # Menstruation - comprehensive
    "menstruation", "menstrual", "period", "periods", "monthly",
    "cycle", "menstrual cycle", "flow", "bleeding", "spotting",
    "heavy periods", "light periods", "irregular periods", "regular",
    "first period", "menarche", "late period", "missed period",
    "cramps", "menstrual cramps", "period pain", "dysmenorrhea",
    "pms", "premenstrual syndrome", "pmdd", "bloating", "swelling",
    "mood swings", "irritability", "emotional", "sensitive",
    "breast tenderness", "fatigue", "headache", "backache",
    "pad", "pads", "sanitary pad", "maxi pad", "mini pad",
    "panty liner", "tampon", "tampons", "applicator", "insertion",
    "menstrual cup", "cup", "reusable", "eco-friendly", "sustainable",
    "period underwear", "leak", "stain", "protection", "absorbent",
    "toxic shock syndrome", "tss", "hygiene", "changing",
    "ovulation", "ovulatory", "fertile", "fertility", "luteal phase",
    "follicular phase", "hormone fluctuation", "estrogen", "progesterone",
    
    # Hormones & emotional changes
    "hormones", "hormone", "hormonal", "hormone changes", "fluctuation",
    "estrogen", "testosterone", "growth hormone", "insulin", "cortisol",
    "adrenaline", "endorphins", "serotonin", "dopamine", "oxytocin",
    "mood", "emotions", "emotional", "feelings", "mood swings",
    "happy", "sad", "angry", "frustrated", "confused", "overwhelmed",
    "excited", "nervous", "anxious", "worried", "stressed", "calm",
    "body image", "self-image", "self-perception", "appearance",
    "looks", "attractiveness", "beauty", "handsome", "pretty",
    "self-esteem", "self-worth", "confidence", "insecurity", "doubt",
    "comparison", "jealousy", "envy", "acceptance", "self-acceptance",
    
    # Sexual health education basics
    "sexual health", "sexuality", "sexual development", "sexual maturity",
    "sexual feelings", "sexual thoughts", "curiosity", "normal",
    "attraction", "attracted", "crush", "like", "love", "romance",
    "romantic feelings", "dating", "relationship", "partner",
    "boyfriend", "girlfriend", "significant other", "couple",
    "single", "available", "taken", "commitment", "exclusive",
    "kissing", "making out", "first kiss", "peck", "french kiss",
    "intimacy", "intimate", "closeness", "affection", "touching",
    "hugging", "holding hands", "cuddling", "snuggling", "lap",
    
    # Boundaries & consent - comprehensive
    "boundaries", "personal boundaries", "physical boundaries",
    "emotional boundaries", "limits", "comfort zone", "uncomfortable",
    "consent", "permission", "agreement", "willing", "ready",
    "enthusiastic consent", "ongoing consent", "yes", "no",
    "maybe", "stop", "wait", "slow down", "not ready",
    "saying no", "right to say no", "respect", "respectful",
    "communication", "talking", "discussion", "expressing feelings",
    "listening", "understanding", "empathy", "consideration",
    "pressure", "peer pressure", "social pressure", "coercion",
    "manipulation", "guilt trip", "threats", "intimidation",
    "force", "against will", "unwanted", "inappropriate",
    
    # Safe practices & protection
    "safe sex", "safer sex", "protection", "protect", "safety",
    "responsible", "responsibility", "smart choices", "wise decisions",
    "thinking ahead", "planning", "preparation", "readiness",
    "condom", "condoms", "latex", "barrier method", "contraception",
    "birth control", "family planning", "pregnancy prevention",
    "effectiveness", "proper use", "consistent use", "failure rate",
    "abstinence", "celibacy", "waiting", "postponing", "delaying",
    "virgin", "virginity", "first time", "sexual debut", "experience",
    
    # STI prevention & awareness - age appropriate
    "sti", "stis", "std", "stds", "sexually transmitted infection",
    "sexually transmitted disease", "infection", "contagious",
    "transmission", "spread", "prevention", "protect", "protection",
    "testing", "screening", "checkup", "diagnosis", "treatment",
    "curable", "treatable", "manageable", "chronic", "symptoms",
    "asymptomatic", "no symptoms", "silent infection", "carrier",
    "hiv", "aids", "human immunodeficiency virus", "immune system",
    "herpes", "cold sores", "fever blisters", "outbreak", "recurrent",
    "chlamydia", "gonorrhea", "syphilis", "trichomoniasis",
    "hpv", "human papillomavirus", "genital warts", "cervical cancer",
    "hepatitis", "hepatitis a", "hepatitis b", "hepatitis c",
    "yeast infection", "bacterial vaginosis", "urinary tract infection",
    
    # Pregnancy basics - educational
    "pregnancy", "pregnant", "conception", "fertilization", "implantation",
    "embryo", "fetus", "baby", "unborn", "expecting", "gravid",
    "pregnancy test", "home test", "urine test", "blood test",
    "positive", "negative", "false positive", "false negative",
    "due date", "gestation", "trimester", "prenatal", "antenatal",
    "unplanned pregnancy", "unexpected pregnancy", "teen pregnancy",
    "teenage pregnancy", "young parent", "early parenthood",
    "options", "choices", "decision", "parenting", "raising child",
    "adoption", "placing for adoption", "open adoption", "closed adoption",
    "abortion", "termination", "medical abortion", "surgical abortion",
    "counseling", "pregnancy counseling", "options counseling",
    "support", "family support", "partner support", "resources",
    
    # Consent & safety - comprehensive
    "sexual harassment", "harassment", "unwelcome", "unwanted",
    "inappropriate touching", "inappropriate behavior", "misconduct",
    "abuse", "sexual abuse", "molestation", "assault", "rape",
    "date rape", "acquaintance rape", "stranger rape", "violence",
    "victim", "survivor", "trauma", "traumatic", "recovery",
    "reporting", "tell someone", "trusted adult", "authority figure",
    "police", "law enforcement", "counselor", "therapist",
    "crisis center", "hotline", "helpline", "support group",
    "safety", "personal safety", "situational awareness", "precautions",
    "buddy system", "staying together", "safe environment",
    "dangerous situation", "red flags", "warning signs", "gut feeling",
    
    # LGBTQ+ awareness - comprehensive
    "lgbtq", "lgbt", "gay", "lesbian", "bisexual", "transgender",
    "straight", "heterosexual", "homosexual", "cisgender", "queer",
    "questioning", "unsure", "figuring out", "exploring", "discovery",
    "sexual orientation", "attraction", "romantic attraction",
    "physical attraction", "emotional attraction", "preference",
    "gender identity", "gender expression", "masculine", "feminine",
    "androgynous", "non-binary", "genderfluid", "transgender",
    "trans", "transition", "transitioning", "coming out",
    "closet", "in the closet", "out", "outing", "disclosure",
    "acceptance", "self-acceptance", "family acceptance", "support",
    "supportive", "ally", "allyship", "pride", "community",
    "discrimination", "prejudice", "homophobia", "transphobia",
    "bullying", "harassment", "hate", "bias", "stereotypes",
    "inclusion", "inclusive", "diversity", "equal rights", "equality",
    
    # Mental health - comprehensive
    "mental health", "emotional health", "psychological", "wellbeing",
    "mental illness", "mental disorder", "psychological disorder",
    "depression", "depressed", "sad", "sadness", "hopeless",
    "worthless", "empty", "numb", "crying", "tearful", "grief",
    "anxiety", "anxious", "worried", "worry", "fear", "fearful",
    "panic", "panic attack", "nervous", "jittery", "restless",
    "stress", "stressed", "overwhelmed", "pressure", "tension",
    "burnout", "exhausted", "fatigue", "tired", "drained",
    "mood disorder", "bipolar", "manic", "mania", "mood swings",
    "irritable", "angry", "rage", "explosive", "aggressive",
    "obsessive", "compulsive", "ocd", "perfectionist", "control",
    "eating disorder", "anorexia", "bulimia", "binge eating",
    "body dysmorphia", "distorted", "unrealistic", "unhealthy",
    "self-harm", "cutting", "self-injury", "hurting self",
    "suicide", "suicidal", "thoughts", "ideation", "plan",
    "attempt", "crisis", "emergency", "help", "intervention",
    
    # Coping & support
    "coping", "coping skills", "strategies", "techniques", "tools",
    "healthy coping", "unhealthy coping", "adaptive", "maladaptive",
    "counseling", "therapy", "psychotherapy", "treatment",
    "therapist", "counselor", "psychologist", "psychiatrist",
    "social worker", "peer counselor", "support group",
    "group therapy", "individual therapy", "family therapy",
    "medication", "antidepressant", "anti-anxiety", "mood stabilizer",
    "prescription", "psychiatric medication", "side effects",
    "mindfulness", "meditation", "breathing exercises", "relaxation",
    "yoga", "exercise", "physical activity", "endorphins",
    "journaling", "writing", "expression", "art therapy",
    "music therapy", "creative expression", "hobbies", "interests",
    
    # Common health issues - comprehensive
    "acne", "pimples", "zits", "skin problems", "dermatology",
    "allergies", "seasonal allergies", "hay fever", "asthma",
    "breathing problems", "inhaler", "epipen", "anaphylaxis",
    "cold", "common cold", "flu", "influenza", "virus", "viral",
    "bacterial", "strep throat", "mono", "mononucleosis",
    "fever", "chills", "sweats", "cough", "congestion", "runny nose",
    "sore throat", "headache", "migraine", "tension headache",
    "nausea", "vomiting", "stomach ache", "cramps", "diarrhea",
    "constipation", "bloating", "gas", "indigestion", "heartburn",
    "dehydration", "hydration", "water", "fluids", "electrolytes",
    "nutrition", "malnutrition", "diet", "eating habits", "appetite",
    "weight", "underweight", "overweight", "obesity", "bmi",
    "eating disorder", "restrictive eating", "binge eating",
    "purging", "laxatives", "diet pills", "unhealthy weight loss",
    
    # Physical fitness & activity
    "exercise", "physical activity", "fitness", "workout", "training",
    "cardio", "cardiovascular", "aerobic", "anaerobic", "strength",
    "muscle building", "endurance", "flexibility", "stretching",
    "sports", "athletics", "team sports", "individual sports",
    "competition", "performance", "improvement", "goals",
    "injury", "sports injury", "sprain", "strain", "fracture",
    "concussion", "head injury", "recovery", "rehabilitation",
    "rest", "ice", "compression", "elevation", "rice method",
    
    # Sleep & rest
    "sleep", "sleeping", "rest", "tired", "fatigue", "exhaustion",
    "insomnia", "sleep problems", "sleep disorder", "night terrors",
    "nightmares", "sleepwalking", "sleep talking", "snoring",
    "sleep apnea", "restless leg syndrome", "circadian rhythm",
    "melatonin", "sleep hygiene", "bedtime routine", "bedroom",
    "comfortable", "pillow", "mattress", "temperature", "noise",
    "screen time", "electronics", "blue light", "caffeine",
    "nap", "napping", "oversleeping", "sleep deprivation",
    
    # Substance awareness - comprehensive
    "substance", "substance use", "substance abuse", "addiction",
    "dependence", "withdrawal", "tolerance", "recovery", "sobriety",
    "alcohol", "drinking", "beer", "wine", "liquor", "spirits",
    "drunk", "intoxicated", "tipsy", "buzzed", "hangover",
    "underage drinking", "binge drinking", "alcoholism",
    "smoking", "tobacco", "cigarettes", "nicotine", "addiction",
    "cancer", "lung disease", "secondhand smoke", "quit smoking",
    "vaping", "e-cigarettes", "juul", "vape pen", "pods",
    "nicotine addiction", "teen vaping", "lung injury", "popcorn lung",
    "drugs", "illegal drugs", "street drugs", "prescription abuse",
    "marijuana", "weed", "pot", "cannabis", "thc", "edibles",
    "cocaine", "crack", "heroin", "opioids", "pills", "painkillers",
    "stimulants", "depressants", "hallucinogens", "psychedelics",
    "ecstasy", "mdma", "molly", "lsd", "mushrooms", "meth",
    "overdose", "od", "poisoning", "emergency", "medical attention",
    "peer pressure", "saying no", "refusal skills", "alternatives",
    "consequences", "legal consequences", "health consequences",
    "academic consequences", "social consequences", "family impact",
    
    # Safety & emergency - comprehensive
    "safety", "safe", "danger", "dangerous", "risk", "risky",
    "hazard", "hazardous", "accident", "injury", "hurt", "harm",
    "emergency", "crisis", "urgent", "immediate", "911", "help",
    "first aid", "cpr", "aed", "choking", "heimlich maneuver",
    "bleeding", "cut", "wound", "bandage", "pressure", "tourniquet",
    "burn", "scald", "fire", "heat", "chemical", "electrical",
    "poison", "toxic", "overdose", "allergic reaction", "shock",
    "unconscious", "fainting", "seizure", "convulsion", "stroke",
    "heart attack", "chest pain", "difficulty breathing", "paralysis",
    "fracture", "broken bone", "dislocation", "sprain", "concussion",
    "ambulance", "paramedic", "emt", "hospital", "emergency room",
    "urgent care", "trauma", "life-threatening", "critical",
    
    # Healthcare access - comprehensive
    "healthcare", "health insurance", "coverage", "copay", "deductible",
    "in-network", "out-of-network", "provider", "primary care",
    "family doctor", "pediatrician", "specialist", "referral",
    "appointment", "scheduling", "wait time", "availability",
    "clinic", "community health center", "school health",
    "school nurse", "health office", "nurse practitioner",
    "physician assistant", "telemedicine", "virtual visit",
    "confidentiality", "privacy", "hipaa", "medical record",
    "consent", "parental consent", "minor rights", "emancipation",
    "teen rights", "reproductive rights", "healthcare rights",
    "access", "barriers", "cost", "transportation", "language",
    "cultural", "discrimination", "stigma", "judgment",
    
    # Healthy relationships - comprehensive
    "relationship", "healthy relationship", "unhealthy relationship",
    "toxic relationship", "abusive relationship", "controlling",
    "possessive", "jealous", "manipulative", "gaslighting",
    "red flags", "warning signs", "love bombing", "isolation",
    "friendship", "friend", "best friend", "close friend", "peer",
    "family", "parents", "siblings", "relatives", "guardians",
    "romantic relationship", "dating", "boyfriend", "girlfriend",
    "partner", "significant other", "crush", "attraction",
    "communication", "talking", "listening", "understanding",
    "empathy", "compassion", "support", "encouragement",
    "trust", "honesty", "loyalty", "faithfulness", "respect",
    "equality", "partnership", "teamwork", "compromise",
    "conflict", "disagreement", "argument", "fight", "resolution",
    "apology", "forgiveness", "making up", "working it out",
    "breaking up", "breakup", "separation", "divorce", "moving on",
    
    # Body positivity & self-care
    "body positive", "body positivity", "self-acceptance", "self-love",
    "self-care", "self-compassion", "kindness", "gentleness",
    "confidence", "self-confidence", "self-worth", "value",
    "unique", "individual", "special", "worthy", "deserving",
    "comparison", "social media", "filters", "photoshop", "editing",
    "unrealistic standards", "beauty standards", "media influence",
    "peer influence", "societal pressure", "cultural expectations",
    "diversity", "different", "variety", "normal", "average",
    "healthy", "unhealthy", "balance", "moderation", "extremes",
    "perfectionism", "perfectionist", "good enough", "progress",
    "growth", "development", "learning", "mistakes", "failure",
    "success", "achievement", "goals", "dreams", "aspirations",
    
    # Education & resources
    "education", "health education", "sex education", "comprehensive",
    "abstinence-only", "medically accurate", "evidence-based",
    "curriculum", "class", "course", "lesson", "information",
    "knowledge", "learning", "understanding", "awareness",
    "facts", "truth", "myths", "misconceptions", "rumors",
    "reliable", "credible", "trustworthy", "accurate", "up-to-date",
    "source", "website", "book", "article", "pamphlet", "brochure",
    "video", "documentary", "podcast", "app", "online resource",
    "library", "health center", "clinic", "organization",
    "nonprofit", "government", "health department", "cdc", "who",
    
    # Communication & support
    "communication", "talking", "discussion", "conversation",
    "sharing", "expressing", "feelings", "thoughts", "concerns",
    "questions", "curiosity", "wondering", "confused", "unclear",
    "parent", "mom", "dad", "mother", "father", "guardian",
    "family", "sibling", "brother", "sister", "relative",
    "trusted adult", "mentor", "role model", "teacher", "coach",
    "counselor", "therapist", "clergy", "pastor", "rabbi", "imam",
    "friend", "peer", "buddy", "confidant", "support person",
    "listening", "hearing", "understanding", "empathy", "compassion",
    "judgment-free", "non-judgmental", "safe space", "comfortable",
    "anonymous", "confidential", "private", "secret", "personal",
    "helpline", "hotline", "crisis line", "text line", "chat",
    "24/7", "available", "accessible", "free", "no cost",
    
    # Personal values & decision making
    "values", "morals", "ethics", "beliefs", "principles", "standards",
    "religion", "spirituality", "faith", "culture", "tradition",
    "family values", "personal values", "individual", "choice",
    "decision", "decision making", "thinking", "considering",
    "weighing options", "pros and cons", "consequences", "outcomes",
    "responsibility", "accountability", "ownership", "maturity",
    "readiness", "prepared", "timing", "right time", "wrong time",
    "pressure", "rushed", "hasty", "impulsive", "thoughtful",
    "careful", "cautious", "wise", "smart", "intelligent",
    "future", "goals", "dreams", "plans", "aspirations",
    "education", "career", "college", "university", "success",
    "achievement", "potential", "opportunity", "possibility",
    "self-respect", "dignity", "worth", "value", "empowerment",
    "strength", "courage", "bravery", "confidence", "independence"
]
