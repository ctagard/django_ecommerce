chmod +x ./cloud-sql-proxy
./cloud-sql-proxy optical-carrier-382621:us-east4:django-ecommerce-db=tcp:6543 -credential_file='djangoDbKey.json'