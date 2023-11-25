# context_processors.py
def add_user_id(request):
    user_id = request.user.id if request.user.is_authenticated else None
    return {'user_id': user_id}
