# 🐳 Configuration Docker pour le Projet Polyrezo

Ce document explique comment démarrer la base de données PostgreSQL avec Docker Compose.

---

## 📋 Prérequis

- **Docker Desktop** installé et lancé
  - Windows/Mac : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux : Installer Docker Engine + Docker Compose

---

## 🚀 Démarrage rapide

### 1. Démarrer la base de données

```bash
# À la racine du projet
docker-compose up -d
```

**Résultat attendu** :
```
✅ Container polyrezo-db   Started
```

### 2. Vérifier que le container tourne

```bash
docker-compose ps
```

**Résultat attendu** :
```
NAME            IMAGE          STATUS         PORTS
polyrezo-db     postgres:18    Up (healthy)   0.0.0.0:5433->5432/tcp
```

### 3. Démarrer le backend

```bash
cd backend
mvn spring-boot:run
```

**Le backend se connectera automatiquement à PostgreSQL sur le port 5433.**

---

## 🛠️ Commandes utiles

### Arrêter la base de données (conserve les données)
```bash
docker-compose stop
```

### Redémarrer la base de données
```bash
docker-compose start
```

### Arrêter et supprimer le container (conserve les données)
```bash
docker-compose down
```

### 🗑️ Reset complet (SUPPRIME toutes les données)
```bash
docker-compose down -v
docker-compose up -d
```

### Voir les logs en temps réel
```bash
docker-compose logs -f postgres
```

### Se connecter à PostgreSQL via le terminal
```bash
docker exec -it polyrezo-db psql -U polyrezo_user -d polyrezo_db
```

---

## 📊 Informations de connexion

| Paramètre | Valeur |
|-----------|--------|
| **Host** | `localhost` |
| **Port** | `5433` |
| **Database** | `polyrezo_db` |
| **User** | `polyrezo_user` |
| **Password** | `SecurePassword@2025!` |

**JDBC URL** : `jdbc:postgresql://localhost:5433/polyrezo_db`

---

## 🔍 Vérifier que tout fonctionne

### Test 1 : Container en cours d'exécution
```bash
docker ps | grep polyrezo-db
```

### Test 2 : PostgreSQL accessible
```bash
docker exec polyrezo-db pg_isready -U polyrezo_user -d polyrezo_db
```

**Résultat attendu** : `polyrezo_db accepting connections`

### Test 3 : Backend se connecte
```bash
# Démarrer le backend
cd backend
mvn spring-boot:run

# Vérifier les logs Flyway
# Vous devriez voir :
# ✅ Successfully validated 4 migrations
# ✅ Schema "public" is up to date
```

---

## 🗄️ Persistance des données

Les données PostgreSQL sont stockées dans un **volume Docker persistant** :
- **Volume** : `projet_r-seau_postgres_data`
- **Emplacement** : Géré par Docker

### Les données persistent même si :
- ✅ Vous arrêtez le container (`docker-compose stop`)
- ✅ Vous redémarrez votre PC
- ✅ Vous supprimez le container (`docker-compose down`)

### Les données disparaissent si :
- ❌ Vous utilisez le flag `-v` : `docker-compose down -v`
- ❌ Vous supprimez manuellement le volume

---

## 🐛 Résolution de problèmes

### Problème : Port 5433 déjà utilisé

**Symptôme** :
```
Error: Bind for 0.0.0.0:5433 failed: port is already allocated
```

**Solutions** :

#### Option 1 : Arrêter l'ancien container
```bash
docker ps
docker stop <container-id-utilisant-5433>
```

#### Option 2 : Changer le port dans `docker-compose.yml`
```yaml
ports:
  - "5434:5432"  # Utiliser 5434 au lieu de 5433
```

Puis mettre à jour `backend/src/main/resources/application.yml` :
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5434/polyrezo_db
```

---

### Problème : Container ne démarre pas

**Vérifier les logs** :
```bash
docker-compose logs postgres
```

**Recréer le container** :
```bash
docker-compose down
docker-compose up -d
```

---

### Problème : Backend ne se connecte pas

**Vérifier que PostgreSQL est prêt** :
```bash
docker-compose ps
# STATUS doit être "Up (healthy)"
```

**Vérifier la configuration du backend** :

Dans `backend/src/main/resources/application.yml` :
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/polyrezo_db
    username: polyrezo_user
    password: SecurePassword@2025!
```

---

### Problème : Migrations Flyway échouent

**Reset complet de la base** :
```bash
# 1. Supprimer volume et container
docker-compose down -v

# 2. Recréer
docker-compose up -d

# 3. Attendre que PostgreSQL soit prêt
docker-compose logs -f postgres
# Attendre "database system is ready to accept connections"

# 4. Relancer le backend
cd backend
mvn spring-boot:run
```

---

## 📦 Structure des volumes

```
Docker Volumes
└── projet_r-seau_postgres_data
    └── pgdata/
        ├── base/          # Tables et données
        ├── global/        # Métadonnées globales
        ├── pg_wal/        # Write-Ahead Logs
        └── ...
```

**Lister les volumes** :
```bash
docker volume ls
```

**Inspecter le volume** :
```bash
docker volume inspect projet_r-seau_postgres_data
```

**Supprimer le volume** (⚠️ supprime toutes les données) :
```bash
docker-compose down -v
```

---

## 🔐 Sécurité

### ⚠️ Pour le développement uniquement

Les identifiants dans `.env.docker` sont **OK pour le développement** car :
- Pas de données sensibles
- Accessible uniquement en local
- Volume Docker isolé

### ⚠️ Pour la production

- Changer le mot de passe
- Utiliser des secrets Docker
- Ne pas exposer le port 5433 publiquement
- Utiliser des variables d'environnement sécurisées

---

## 📚 Ressources

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Documentation Flyway](https://flywaydb.org/documentation/)

---

## ✅ Checklist de démarrage

- [ ] Docker Desktop installé et lancé
- [ ] Cloner le projet : `git clone <url>`
- [ ] Lancer PostgreSQL : `docker-compose up -d`
- [ ] Vérifier le container : `docker-compose ps`
- [ ] Lancer le backend : `cd backend && mvn spring-boot:run`
- [ ] Vérifier les migrations : Voir les logs Flyway
- [ ] Tester l'API : `curl http://localhost:8080/api/schools`

---

## 🎉 C'est prêt !

Si vous voyez :
```
✅ Started BackendApplication in X.XXX seconds
✅ Tomcat started on port 8080
```

**Votre environnement est opérationnel !** 🚀
