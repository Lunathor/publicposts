from django.shortcuts import render
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Post
from .serializers import *
# Create your views here.

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Эндпоинт для получения CSRF токена"""
    return Response({'csrfToken': get_token(request)})
@api_view(['GET', 'POST'])
def posts(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many = True)
        return(Response({'data': serializer.data}))
    elif request.method == 'POST':
        post = Post()
        post.text = request.data['text']
        post.save()
        return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
def like_post(request, post_id):
    if request.method == 'GET':
        try:
            post = Post.objects.get(id = post_id)
        except:
            return Response(status= status.HTTP_400_BAD_REQUEST)
        
        post.likesCount += 1
        post.save()
        return Response({'likesCount': post.likesCount}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_post(request, post_id):
    if request.method == 'DELETE':
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return Response({'message': 'Post deleted successfully'}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def dislike_post(request, post_id):
    if request.method == 'GET':
        try:
            post = Post.objects.get(id = post_id)
        except:
            return Response(status= status.HTTP_400_BAD_REQUEST)

        post.dislikesCount += 1
        post.save()
        return Response({'dislikesCount': post.dislikesCount}, status=status.HTTP_200_OK)

@api_view(['PUT', 'PATCH'])
def update_post(request, post_id):
    """Эндпоинт для обновления поста"""
    if request.method in ['PUT', 'PATCH']:
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Обновляем текст поста
        if 'text' in request.data:
            post.text = request.data['text']
            post.save()
            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Text field is required'}, status=status.HTTP_400_BAD_REQUEST)
