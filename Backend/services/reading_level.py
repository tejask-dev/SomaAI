def adapt_reading_level(answer, lang, reading_level):
    # For hackathon: just return answer; replace with model call for true adaptation
    if reading_level == "simple":
        return answer  # TODO: rephrase for simplicity
    elif reading_level == "detailed":
        return answer + " (More detail...)"  # TODO: enrich
    else:
        return answer