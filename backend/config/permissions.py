from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name='Admin').exists()
        )


class IsContentManager(permissions.BasePermission):
    """
    Custom permission to only allow content managers.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name='Content Manager').exists()
        )


class IsAdminOrContentManager(permissions.BasePermission):
    """
    Custom permission to allow admin or content manager users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return (
            request.user.groups.filter(name='Admin').exists() or
            request.user.groups.filter(name='Content Manager').exists()
        )


class IsAdminOrContentManagerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow public read access (GET) but restrict
    write operations (POST, PUT, PATCH, DELETE) to admin or content managers.
    """
    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS) for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Restrict unsafe methods to authenticated admin or content managers
        if not request.user or not request.user.is_authenticated:
            return False

        return (
            request.user.groups.filter(name='Admin').exists() or
            request.user.groups.filter(name='Content Manager').exists()
        )