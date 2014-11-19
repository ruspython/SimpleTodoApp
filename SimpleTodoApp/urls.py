from django.conf.urls import patterns, include, url
from django.contrib import admin
from todo.views import *


urlpatterns = patterns('',

    url(r'^$', TodoListView.as_view(), name='home'),
    url(r'^api/todo/$', TodoSuggest.as_view()),
    url(r'^api/add/$', 'todo.views.add'),
    url(r'^api/do-undo/$', 'todo.views.do_undo'),
    url(r'^api/remove/$', 'todo.views.remove'),
    url(r'^api/clear-done/$', 'todo.views.clear_done'),
    url(r'^api/edit/$', 'todo.views.edit'),
    url(r'^admin/', include(admin.site.urls)),
)
