# 🔄 Synchronisation de la base de données

## Pour ton ami - Comment avoir exactement la même base de données

### Option 1 : Export/Import complet (RECOMMANDÉ)

#### 📤 Toi (qui a les données) :

```bash
# 1. Exporter toute la base de données
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db > backup_polyrezo.sql

# 2. Envoyer le fichier backup_polyrezo.sql à ton ami (Git, Drive, etc.)
```

#### 📥 Ton ami (qui veut les données) :

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

#### 📥 Ton ami :

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

### Option 3 : Export table par table (si problèmes)

#### 📤 Toi :

```bash
# Exporter chaque table séparément
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db -t users --data-only --inserts > users.sql
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db -t events --data-only --inserts > events.sql
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db -t accommodations --data-only --inserts > accommodations.sql
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db -t accommodation_guests --data-only --inserts > accommodation_guests.sql
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db -t rides --data-only --inserts > rides.sql
docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db -t ride_passengers --data-only --inserts > ride_passengers.sql
```

#### 📥 Ton ami :

```bash
# Importer chaque fichier dans l'ordre
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < users.sql
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < events.sql
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < accommodations.sql
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < accommodation_guests.sql
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < rides.sql
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < ride_passengers.sql
```

---

## 🔍 Vérification après import

```bash
# Se connecter à PostgreSQL
docker exec -it polyrezo-db psql -U polyrezo_user -d polyrezo_db

# Vérifier le nombre de lignes dans chaque table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'accommodations', COUNT(*) FROM accommodations
UNION ALL
SELECT 'accommodation_guests', COUNT(*) FROM accommodation_guests
UNION ALL
SELECT 'rides', COUNT(*) FROM rides
UNION ALL
SELECT 'ride_passengers', COUNT(*) FROM ride_passengers;

# Quitter PostgreSQL
\q
```

---

## 🐛 En cas de problème

### Erreur "duplicate key value"

```bash
# Reset et réimport
docker-compose down -v
docker-compose up -d
timeout 10
docker exec -i polyrezo-db psql -U polyrezo_user -d polyrezo_db < backup_polyrezo.sql
```

### Les UUIDs ne correspondent pas

➡️ Utiliser **Option 1** (export/import complet) qui préserve tous les IDs

---

## 💡 Conseils

- **Option 1** est la plus sûre (préserve tout : structure + données + UUIDs)
- **Option 2** si ton ami a déjà la bonne structure avec les migrations
- **Option 3** pour débugger ou si import partiel
- Toujours faire un backup avant d'importer : `docker exec polyrezo-db pg_dump -U polyrezo_user polyrezo_db > backup_avant_import.sql`
