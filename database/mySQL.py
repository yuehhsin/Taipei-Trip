import os,mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

load_dotenv()

# dbconfig = { 
#     "host":"localhost",
#     "user":"root",
#     "password": os.getenv("password"),
#     "database": os.getenv("database"),
#     "buffered":True
#     }
dbconfig = { 
    "host":"localhost",
    "user":"root",
    "password": "KElly_7991",
    "database": "gov_data",
    "buffered": True
    }

dbpool=mysql.connector.pooling.MySQLConnectionPool(pool_name = "pool", pool_size = 10, **dbconfig)

mydb = dbpool.get_connection()
cursor = mydb.cursor()
cursor.execute("SELECT COUNT(id) FROM taipei_attractions")