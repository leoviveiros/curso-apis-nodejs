# Links

# PostreSQL
### adminer
http://localhost:8080

### pacotes
npm install sequelizer pg-hstore pg


# MongoDB

### mongo-express
http://localhost:8081

## Init Database - Heroes 

### mongodb
docker exec -it mongodb mongo -u root -p root --authenticationDatabase=admin

db.getSiblingDB('heroes').createUser({user: 'admin', pwd: 'admin', roles: [{ role: 'readWrite', db: 'heroes' }] })