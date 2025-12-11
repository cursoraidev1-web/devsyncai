# Security Policy Quick Reference Guide

This is a condensed reference for daily development. For complete details, see [SECURITY_POLICY.md](SECURITY_POLICY.md).

---

## 🚀 Quick Start Checklist

### Before Starting Development
- [ ] SonarQube project configured
- [ ] CI/CD pipeline includes SonarQube scan
- [ ] Quality gate enabled and enforced
- [ ] Local SonarQube scanner installed (optional)

### Before Committing Code
- [ ] No hardcoded secrets or credentials
- [ ] All dependencies up-to-date
- [ ] Input validation implemented
- [ ] Error messages don't leak sensitive info
- [ ] Tests written and passing

### Before Merging/Deploying
- [ ] SonarQube quality gate: PASSED ✅
- [ ] Code review completed
- [ ] All comments addressed
- [ ] Security rating: A
- [ ] 0 blocker issues

---

## 📊 SonarQube Quality Gate Requirements

| Metric | Required Threshold |
|--------|-------------------|
| **Security Hotspots Reviewed** | 100% |
| **Security Rating** | A |
| **Reliability Rating** | A |
| **Maintainability Rating** | B or better |
| **Coverage on New Code** | ≥80% |
| **Blocker Issues** | 0 |
| **Critical Issues** | ≤5 (with remediation plan) |

---

## 🎯 Team-Specific Quick Reference

### ☁️ Cloud Team

**Top Priorities:**
1. ✅ No hardcoded credentials (use secret managers)
2. ✅ No public S3 buckets without approval
3. ✅ Security groups: no 0.0.0.0/0 on sensitive ports
4. ✅ Enable encryption at rest and in transit
5. ✅ All containers run as non-root

**Key SonarQube Rules:**
- S6245: S3 buckets not public
- S6249: Security groups restrictive
- S6290: No hardcoded AWS credentials
- S6303: RDS encryption enabled

**Quick Commands:**
```bash
# Scan Terraform
sonar-scanner -Dsonar.sources=. -Dsonar.inclusions=**/*.tf

# Scan Kubernetes YAML
sonar-scanner -Dsonar.sources=. -Dsonar.inclusions=**/*.yaml,**/*.yml
```

---

### 🔧 Backend Team

**Top Priorities:**
1. ✅ Use parameterized queries (prevent SQL injection)
2. ✅ Validate and sanitize all inputs
3. ✅ Proper authentication on all endpoints
4. ✅ No sensitive data in logs
5. ✅ Keep dependencies updated

**OWASP Top 10 Quick Checks:**
- **A01 - Broken Access Control**: Authorization on every endpoint?
- **A02 - Cryptographic Failures**: Using strong encryption (AES-256, TLS 1.2+)?
- **A03 - Injection**: Parameterized queries? Input validation?
- **A05 - Security Misconfiguration**: No default credentials?
- **A06 - Vulnerable Dependencies**: Dependencies scanned and updated?

**Key SonarQube Rules:**
- S2077, S3649: SQL injection prevention
- S2076: Command injection prevention
- S5145: No sensitive data in logs
- S2068: No hardcoded passwords

**Quick Commands:**
```bash
# Java/Maven
mvn clean verify sonar:sonar

# Node.js
npm run test && sonar-scanner

# Python
pytest --cov && sonar-scanner

# Go
go test ./... -coverprofile=coverage.out && sonar-scanner
```

---

### 🎨 Frontend Team

**Top Priorities:**
1. ✅ Prevent XSS (sanitize all dynamic content)
2. ✅ Implement Content Security Policy (CSP)
3. ✅ HTTPS only, no mixed content
4. ✅ No sensitive data in localStorage
5. ✅ CSRF protection enabled

**Key Security Controls:**
- **XSS Prevention**: Use framework sanitization, no `dangerouslySetInnerHTML`
- **CSRF**: Tokens on state-changing operations
- **Secrets**: No API keys in client code
- **Communication**: HTTPS only, secure cookies (httpOnly, secure, SameSite)

**Key SonarQube Rules:**
- S5131: XSS prevention
- S6333: Avoid dangerouslySetInnerHTML
- S6265: No hardcoded API keys
- S5332: Use HTTPS

**Quick Commands:**
```bash
# React/Next.js
npm run test -- --coverage && sonar-scanner

# Angular
ng test --code-coverage && sonar-scanner

# Vue.js
npm run test:unit -- --coverage && sonar-scanner
```

**CSP Header Example:**
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com
```

---

### 🤖 AI/ML Team

**Top Priorities:**
1. ✅ Secure training data (anonymize PII)
2. ✅ Validate all inputs to models
3. ✅ No credentials in Jupyter notebooks
4. ✅ Model versioning and integrity checks
5. ✅ Rate limiting on model APIs

**Security Focus Areas:**
- **Data Security**: Encrypt data, anonymize PII, access controls
- **Model Security**: Version control, signing, integrity validation
- **Inference Security**: Input validation, rate limiting, output filtering
- **Privacy**: GDPR/CCPA compliance, differential privacy

**Key SonarQube Rules:**
- S5135: Avoid insecure pickle deserialization
- S6265: No credentials in notebooks
- S5131: Validate inputs
- S2077: SQL injection in data queries

**Quick Commands:**
```bash
# Scan Python ML project
pytest --cov=src && sonar-scanner

# Clean notebooks before commit (remove output)
jupyter nbconvert --clear-output --inplace notebooks/*.ipynb

# Scan notebooks
sonar-scanner -Dsonar.sources=. -Dsonar.inclusions=**/*.py,**/*.ipynb
```

**Secure Model Serving:**
```python
# Input validation example
def validate_input(data):
    if not isinstance(data, dict):
        raise ValueError("Invalid input format")
    # Add size limits
    if len(str(data)) > MAX_INPUT_SIZE:
        raise ValueError("Input too large")
    # Sanitize inputs
    return sanitize(data)
```

---

## 🔐 Common Security Patterns

### Secrets Management
```bash
# DON'T ❌
DB_PASSWORD="hardcoded_password"

# DO ✅
# AWS
DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id db-password --query SecretString --output text)

# Azure
DB_PASSWORD=$(az keyvault secret show --name db-password --vault-name my-vault --query value -o tsv)

# HashiCorp Vault
DB_PASSWORD=$(vault kv get -field=password secret/database)
```

### SQL Injection Prevention
```python
# DON'T ❌
query = f"SELECT * FROM users WHERE id = {user_id}"

# DO ✅
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_id,))
```

### XSS Prevention
```javascript
// DON'T ❌
element.innerHTML = userInput;

// DO ✅
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Authentication Headers
```javascript
// API Request with JWT
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-CSRF-Token': csrfToken
};
```

---

## 🚨 Security Incident Response

### Immediate Actions
1. **Report**: Email security@[organization].com or #security-incidents on Slack
2. **Provide**:
   - Incident description
   - Severity assessment (P0/P1/P2/P3)
   - Affected systems
   - Current status

### Severity Guide
- **P0 (Critical)**: Active breach, exposed customer data → Response: IMMEDIATE
- **P1 (High)**: High-risk vulnerability in production → Response: 4 hours
- **P2 (Medium)**: Medium-risk vulnerability → Response: 24 hours
- **P3 (Low)**: Low-risk vulnerability → Response: 7 days

---

## 🛠️ Essential Tools & Commands

### SonarQube Scanner
```bash
# Install
npm install -g sonarqube-scanner
# or
brew install sonar-scanner

# Basic scan
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarqube.example.com \
  -Dsonar.login=YOUR_TOKEN

# Verbose mode (debugging)
sonar-scanner -Dsonar.verbose=true
```

### Dependency Scanning
```bash
# Node.js
npm audit
npm audit fix

# Python
pip-audit
safety check

# Java
mvn dependency-check:check

# Go
go list -json -m all | nancy sleuth
```

### Secret Scanning (pre-commit)
```bash
# Install gitleaks
brew install gitleaks

# Scan current changes
gitleaks detect --source . --verbose

# Pre-commit hook
gitleaks protect --staged
```

---

## 📚 Quick Links

### Internal Resources
- **SonarQube Dashboard**: https://sonarqube.example.com
- **Security Portal**: https://security.example.com
- **Incident Reporting**: security@example.com
- **Slack Channel**: #security

### Documentation
- [Full Security Policy](SECURITY_POLICY.md)
- [SonarQube Project Template](sonarqube-project-template.properties)
- [Incident Response Playbook](incident-response-playbook.md)

### External Resources
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [SonarQube Rules](https://rules.sonarsource.com/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

## 💡 Pro Tips

1. **Run SonarQube locally** before pushing to catch issues early
2. **Set up pre-commit hooks** for secret scanning
3. **Use IDE plugins** (SonarLint) for real-time feedback
4. **Subscribe to security advisories** for your dependencies
5. **Attend monthly security office hours** for questions

---

## 🎓 Required Training

- [ ] Security Awareness (Annual)
- [ ] SonarQube Usage (Onboarding)
- [ ] Secure Coding Fundamentals (Onboarding)
- [ ] OWASP Top 10 (Annual)
- [ ] Team-specific security training (Quarterly)

---

## 📞 Need Help?

- **SonarQube Questions**: #sonarqube-support or sonarqube-admins@example.com
- **Security Questions**: #security or security@example.com
- **Policy Clarifications**: Your team's Security Champion
- **Urgent Security Issues**: security@example.com + #security-incidents

---

*Last Updated: December 11, 2025*
*Version: 1.0*
