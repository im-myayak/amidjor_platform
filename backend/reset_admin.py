import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

u = User.objects.filter(username='admin').first()
if u:
    u.set_password('admin123')
    u.save()
    print('✅ Mot de passe réinitialisé: admin123')
else:
    print('❌ User admin non trouvé - création...')
    User.objects.create_superuser('admin', '', 'admin123')
    print('✅ Superuser admin créé avec mot de passe: admin123')
