import json,ssl,mysql.connector
from flask import Blueprint,jsonify,request,render_template,session
page = Blueprint("page", __name__)

mydb=mysql.connector.connect(
	host="localhost",
	user="root",
	password="KElly7991",
	database="gov_data",
	charset="utf8",
)
cursor = mydb.cursor()
cursor.execute("SELECT COUNT(id) FROM taipei_attractions")

@page.route("/")
def index():
	return render_template("index.html")
	
@page.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@page.route("/booking")
def booking():
	if "id" in session:
		return render_template("booking.html")
	else:
		return render_template("index.html")

@page.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")