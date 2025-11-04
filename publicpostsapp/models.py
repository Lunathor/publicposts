from django.db import models

# Create your models here.
class Post(models.Model):
	text = models.CharField(max_length=400)
	likesCount = models.IntegerField(default=0)
	dislikesCount = models.IntegerField(default=0)
	date = models.DateTimeField('publish date', auto_now_add=True)


def __str__(self):
    	return self.text