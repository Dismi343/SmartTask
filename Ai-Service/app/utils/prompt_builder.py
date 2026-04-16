def build_prompt(user_prompt, tasks):
    context = "Tasks:\n"

    for t in tasks:
        context += f"- {t.taskTitle} (deadline: {t.deadline}, status: {t.status})\n"

    return context + "\nUser: " + user_prompt