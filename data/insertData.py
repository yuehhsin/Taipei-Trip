import json,mysql.connector

# MYSQL:建立database:gov_data table:taipei_attractions
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

mydb=mysql.connector.connect(
	host="localhost",
	user="root",
	password="kelly7991",
	database="gov_data",
	charset="utf8",
)
cursor = mydb.cursor()

with open("data/taipei-attractions.json",mode="r",encoding="utf-8") as file:
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

