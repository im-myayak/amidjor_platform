# Security Guide - Amidjor Platform

⚠️ **CRITICAL WARNING: Internal API ≠ Security**

This document outlines security considerations and best practices for the Amidjor platform.

---

## 🚨 Critical Warnings

### 1. "Internal" Does NOT Mean Secure

**❌ Wrong assumption:**
```python
# BAD: Thinking "internal" is enough
url = '/api/internal/orders/'  # ❌ NOT protected by URL name!
```

**✅ Correct approach:**
```python
# GOOD: Explicit permission checks
class OrderInternalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]  # ✅ Explicit protection
    # ...
```

**Rule:** URL naming conventions are for human readability ONLY. Security comes from:
- `permission_classes`
- `authentication_classes`
- `throttle_classes`

---

### 2. Analytics API Contains Sensitive Data

**Data exposed in `/api/internal/analytics/*`:**
- Revenue statistics
- Order volumes
- Inventory levels
- Business performance metrics

**✅ Protection required:**
```python
@api_view(['GET'])
@permission_classes([IsAdminUser])  # ✅ Strict admin only
def dashboard_overview(request):
    # ...
```

**⚠️ Future hardening:**
- [ ] Add IP whitelist for analytics endpoints
- [ ] Add audit logging (who accessed what)
- [ ] Implement Redis caching with TTL
- [ ] Add request throttling (10 req/min per user)

---

### 3. Order Status Transitions Are Critical

**⚠️ Never allow direct status modification:**
```python
# ❌ DANGEROUS - Never do this
order.status = request.data['status']  # ❌ Client can set any status!
order.save()
```

**✅ Always use service layer:**
```python
# ✅ CORRECT - Business logic controls transitions
OrderService.confirm_order(order, confirmed_by=request.user)
# OrderService checks: can only confirm if pending/contacted
```

**Valid transitions:**
```
pending → contacted → confirmed → (terminal)
pending → cancelled
contacted → cancelled
confirmed → cancelled
cancelled → (terminal - no transitions)
```

---

## 🔐 Security Checklist

### Authentication
- [x] Public API: AllowAny for read, throttled for write
- [x] Internal API: IsAdminUser required
- [ ] JWT implementation (Phase 2)
- [ ] Refresh token rotation
- [ ] Token blacklisting on logout

### Authorization
- [x] Admin-only for internal endpoints
- [x] Explicit permission classes on all ViewSets
- [ ] Role-based access (Phase 2)
  - [ ] IsStaff (can confirm orders)
  - [ ] IsAdmin (full access)
  - [ ] IsCustomer (own orders only)

### Input Validation
- [x] Price calculated server-side (never trust client)
- [x] Status transitions via service layer
- [x] Serializer validation
- [ ] Rate limiting per action type

### Output Protection
- [x] No sensitive data in public API
- [ ] Field-level permissions (hide cost/profit in response)
- [ ] Pagination for large lists

### Infrastructure
- [ ] HTTPS only (production)
- [ ] CORS whitelist (not wildcard)
- [ ] Security headers (HSTS, CSP)
- [ ] SQL injection protection (ORM usage)
- [ ] XSS protection (DRF handles this)

---

## 🛡️ Security Patterns

### Pattern 1: Defense in Depth

```python
# Multiple layers of protection

# Layer 1: URL routing (organizational)
path('api/internal/', ...)  # Human-readable only

# Layer 2: Authentication
permission_classes = [IsAuthenticated]

# Layer 3: Authorization
permission_classes = [IsAdminUser]

# Layer 4: Business logic validation
OrderService.can_transition_to(order, new_status)

# Layer 5: Audit logging
AuditLog.objects.create(...)
```

### Pattern 2: Service Layer as Gatekeeper

```python
# All state changes go through service layer

class OrderService:
    @staticmethod
    def confirm_order(order, confirmed_by=None):
        # Validation
        if not OrderService.can_transition_to(order, 'confirmed'):
            raise ValidationError('Invalid status transition')
        
        # Business rules
        if order.total_price <= 0:
            raise ValidationError('Cannot confirm order with zero price')
        
        # State change
        old_status = order.status
        order.status = 'confirmed'
        order.save()
        
        # Audit
        AuditLog.objects.create(
            action='order_confirmed',
            user=confirmed_by,
            old_values={'status': old_status},
            new_values={'status': 'confirmed'},
        )
        
        # Side effects
        # send_confirmation_email.delay(order.id)
        
        return order
```

### Pattern 3: Explicit Permission Checks

```python
# Don't rely on default permissions

# ❌ BAD: Implicit permissions
class MyViewSet(viewsets.ModelViewSet):
    pass  # Uses default DRF permissions (AllowAny!)

# ✅ GOOD: Explicit permissions
class OrderInternalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]  # Explicit!
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
```

---

## 🔍 Security Review Points

### Code Review Checklist

For every PR affecting API or business logic:

- [ ] Are permission_classes explicitly defined?
- [ ] Is business logic in service layer (not views/admin)?
- [ ] Are prices calculated server-side?
- [ ] Is user input properly validated?
- [ ] Are there any SQL injection risks?
- [ ] Is sensitive data logged appropriately?
- [ ] Are audit logs added for critical actions?

### API Endpoint Review

```python
# Template for new endpoints
def endpoint_security_check():
    """
    Endpoint: /api/internal/x/y/
    
    Authentication: ✅ Required (IsAdminUser)
    Authorization: ✅ Staff only
    Input Validation: ✅ Serializer + service layer
    Audit Logging: ✅ Created/Modified logged
    Rate Limiting: ⏳ TODO (Phase 2)
    
    Data Exposed:
    - Field A: Public info
    - Field B: Admin only ✅ filtered
    - Field C: Sensitive ✅ excluded
    """
```

---

## 🚨 Common Vulnerabilities to Avoid

### 1. Insecure Direct Object Reference (IDOR)

**❌ Vulnerable:**
```python
@api_view(['GET'])
def get_order(request, order_id):
    order = Order.objects.get(id=order_id)  # ❌ Any ID accessible!
    return Response(OrderSerializer(order).data)
```

**✅ Secure:**
```python
@api_view(['GET'])
@permission_classes([IsAdminUser])  # ✅ Restrict access
def get_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return Response(OrderSerializer(order).data)

# OR for customer API:
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, customer=request.user)  # ✅ Ownership check
    return Response(OrderSerializer(order).data)
```

### 2. Mass Assignment

**❌ Vulnerable:**
```python
# View accepts all fields
serializer = OrderSerializer(data=request.data)
# Client can send: {'status': 'confirmed', 'total_price': 0.01}
```

**✅ Secure:**
```python
# Serializer restricts fields
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ['total_price', 'status', 'created_at']
```

### 3. Business Logic Bypass

**❌ Vulnerable:**
```python
# Admin action bypasses validation
order.status = 'confirmed'
order.total_price = -100
order.save()
```

**✅ Secure:**
```python
# All changes through service layer
OrderService.confirm_order(order)  # ✅ Validates everything
```

---

## 🔐 Production Security Checklist

Before going to production:

### Infrastructure
- [ ] HTTPS only (HSTS enabled)
- [ ] Database credentials in environment variables
- [ ] SECRET_KEY rotated and secured
- [ ] DEBUG = False
- [ ] Allowed hosts configured
- [ ] CORS_ORIGIN_WHITELIST (not wildcard)

### Monitoring
- [ ] Failed login attempts logged
- [ ] Unusual API patterns detected
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### Backup & Recovery
- [ ] Database backups (daily)
- [ ] Tested restore procedure
- [ ] Disaster recovery plan

---

## 📚 Resources

- [Django Security Checklist](https://docs.djangoproject.com/en/4.2/topics/security/)
- [DRF Security](https://www.django-rest-framework.org/api-guide/permissions/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

**Remember: Security is not a feature, it's a process.**

**Last updated:** 2024-01-15  
**Next review:** After Phase 2 implementation
