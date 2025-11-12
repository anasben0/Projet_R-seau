# 🔄 Synchronisation de la base de données

## Comment avoir exactement la même base de données

### Option 1 : Export/Import complet (RECOMMANDÉ)

#### 📤 Toi (qui a les données) :

```bash
# 1. Exporter toute la base de données
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db > backup_polyrezo.sql

```

#### 📥 Autre utilisateur (qui veut les données) :

```bash
# 1. Arrêter le backend s'il tourne
# Ctrl+C dans le terminal du backend

# 2. Reset complet de la base
docker-compose down -v
docker-compose up -d

# 3. Attendre que PostgreSQL soit prêt (quelques secondes)
timeout 10

# 4. Importer ton backup
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < backup_polyrezo.sql

# 5. Redémarrer le backend
cd backend
mvn spring-boot:run
```

---

### Option 2 : Export des données uniquement (sans structure)

#### 📤 Toi :

```bash
# Exporter seulement les données (INSERT statements)
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db --data-only --inserts > data_only.sql
```

#### 📥 Utilisateur :

```bash
# 1. S'assurer que les migrations Flyway sont à jour
cd backend
mvn spring-boot:run
# Attendre que le backend démarre puis l'arrêter (Ctrl+C)

# 2. Importer les données
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < data_only.sql

# 3. Redémarrer
mvn spring-boot:run
```

---
