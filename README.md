# Name Explorer

## Required ENV

NODE_ENV
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS

## Later
- 2nd page - click on name and see historic values in a chart

## Database Migration

Create staging dump file, transfer to local pc, transfer to production, load database.

```bash
# on staging
sudo mysqldump BabyNames > /tmp/babynames.sql
# locally
rsync -P mariadb.staging:/tmp/babynames.sql /tmp/babynames.sql
rsync -P /tmp/babynames.sql mariadb.production:/tmp/babynames.sql
# on production
sudo mysql BabyNames < /tmp/babynames.sql
```
