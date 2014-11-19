from django.shortcuts import HttpResponse
from django.views.generic import ListView
from .models import Todo

import json


class TodoListView(ListView):
    model = Todo
    template_name = 'todo-list.html'
    context_object_name = 'todos'


class TodoSuggest(ListView):
    model = Todo
    template_name = 'todo-suggest.html'
    context_object_name = 'todos'


def add(request):
    desc = json.loads(request.body.decode('utf-8'))['desc']
    todo = Todo(desc=desc)
    todo.save()
    return HttpResponse('')


def do_undo(request):
    todo_id = json.loads(request.body.decode('utf-8'))['id']
    todo = Todo.objects.get(pk=todo_id)
    todo.done = True if not todo.done else False
    todo.save()
    return HttpResponse('')


def clear_done(request):
    todos = Todo.objects.all()
    for todo in todos:
        if todo.done:
            todo.delete()
    return HttpResponse('')


def remove(request):
    todo_id = json.loads(request.body.decode('utf-8'))['id']
    Todo.objects.get(pk=todo_id).delete()
    return HttpResponse('')


def edit(request):
    todo_obj = json.loads(request.body.decode('utf-8'))
    todo_id = todo_obj['id']
    todo_desc = todo_obj['desc']
    todo = Todo.objects.get(pk=todo_id)
    todo.desc = todo_desc
    todo.save()
    return HttpResponse('')

