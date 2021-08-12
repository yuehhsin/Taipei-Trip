import json,mysql.connector

# MYSQL:建立database:gov_data table:taipei_attractions

# CREATE dateabase gov_data;
# 建立會員資訊(table:members)
# CREATE table members(
#     id BIGINT NOT NULL auto_increment,
#     name VARCHAR(255) NOT NULL,
#     email VARCHAR(255) NOT NULL,
#     password VARCHAR(255) NOT NULL,
#     time DATETIME NOT NULL DEFAULT NOW(),
#     PRIMARY KEY ( id )
# )

# #建立風景資訊(table:taipei_attractions)
# CREATE table taipei_attractions( 
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     name VARCHAR(255),
#     category VARCHAR(255),
#     description TEXT,
#     address TEXT,
#     transport TEXT,
#     mrt VARCHAR(255),
#     latitude VARCHAR(50),
#     longitude VARCHAR(50),
#     images TEXT)

# #建立訂單編號(table:bookedInfo)
# CREATE table bookedInfo( 
#     id BIGINT NOT NULL auto_increment PRIMARY KEY,
#     userId INT,
#     number TEXT NOT NULL,
#     price INT NOT NULL,
#     attId INT NOT NULL,
#     attName VARCHAR(50) NOT NULL,
#     attAddress VARCHAR(50) NOT NULL,
#     attImage TEXT NOT NULL,
#     tripDate VARCHAR(50) NOT NULL,
#     tripTime VARCHAR(50) NOT NULL,
#     contactName VARCHAR(50) NOT NULL,
#     contactEmail VARCHAR(50) NOT NULL,
#     contactPhone VARCHAR(50) NOT NULL,
#     status INT NOT NULL)


mydb=mysql.connector.connect(
	host="localhost",
	user="root",
	password="KElly_7991",
	database="gov_data",
	charset="utf8",
)
cursor = mydb.cursor()

with open("/database/data/taipei-attractions.json",mode="r",encoding="utf-8") as file:
    json_data = json.load(file)
    data_list = json_data["result"]["results"]

for data in data_list:
    name = data["stitle"]
    category = data["CAT2"]
    description = data["xbody"]
    address = data["address"]
    transport = data["info"]
    mrt = data["MRT"]
    latitude = data["latitude"]
    longitude = data["longitude"]
    files = data["file"].split("http")
    files.pop(0)
    images = ""

    for image in files:
        if image[-3:].lower()=="jpg" or image[-3:].lower()=="png":
            images+="http"+image+","

    insert = "INSERT INTO taipei_attractions (name,category,description,address,transport,mrt,latitude,longitude,images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    value = (name, category, description, address, transport, mrt, latitude, longitude, images)
    cursor.execute(insert, value)
    mydb.commit()


